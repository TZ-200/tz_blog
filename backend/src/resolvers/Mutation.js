const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { randomBytes } = require('crypto')
const { promisify } = require('util')
const { transport, makeANiceEmail } = require('../mail');
const { hasPermission } = require('../utils')
const stripe = require('../stripe')

const Mutations = {
    // async createItem(parent,args, ctx, info){
    //     if(!ctx.request.userId){
    //         throw new Error('You must be logged in to do that!')
    //     }

    //     // User relationに注目！
    //     const item = await ctx.db.mutation.createItem({
    //         data:{
    //             user: {
    //                 connect: {
    //                     id: ctx.request.userId
    //                 }
    //             },
    //             ...args
    //         }
    //     }, info)

    //     return item
    // },

    // updateItem(parent, args, ctx, info) {
    //     // first take a copy of the updates
    //     const updates = { ...args }
    //     //remove the ID from the updates (idはupdateしたくないので)
    //     delete updates.id
    //     // run the update method
    //     return ctx.db.mutation.updateItem({
    //         data: updates,
    //         where: {
    //             id: args.id
    //         }
    //     }, info)
    // },

    // async deleteItem(parent, args, ctx, info) {
    //     const where = { id: args.id }
    //     // find the item
    //     const item = await ctx.db.query.item({where}, `{id title user { id }}`)
    //     // check if they own that item, on have the permission
    //     const ownsItem = item.user.id === ctx.request.userId
    //     const hasPermissions = ctx.request.user.permissions.some(permission => ['ADMIN','ITEMDELETE'].includes(permission))  // some => 一つでもtrueならtrue
    //     if(!ownsItem && !hasPermissions) {
    //         throw new Error("You don't have permission to do that!")
    //     }
        
    //     // delete it    
    //     return ctx.db.mutation.deleteItem({ where }, info)
    // },

    async signup(parent, args, ctx, info) {
        // emailは全部小文字にした方が色々と都合がいいらしい
        args.email = args.email.toLowerCase()
        // hash their password
        const password = await bcrypt.hash(args.password, 10)
        // create the user in the database
        const user = await ctx.db.mutation.createUser({
            data: {
                ...args,
                password,
            }
        }, info)
        // // create jwt token
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
        // // set the jwt as acookie on the response
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365,  // 1 year cookie
        })
        // return the user to the browser
        return user;
    },

    async createThread(parent, args, ctx, info) {
        if(!ctx.request.userId){
            throw new Error('You must be logged in to do that!')
        }
        const thread = await ctx.db.mutation.createThread({
            data:{
                author: {
                    connect: {
                        id: ctx.request.userId
                    }
                },
                ...args
            }
        }, info)
        return thread
    }

    // async signin( parent, { email, password }, ctx, info) {
    //     // check if there is a user with that email
    //     const user = await ctx.db.query.user({ where: { email }})
    //     if(!user) throw new Error(`No such User found for email ${email}`)
    //     // check if their password is correct
    //     const valid = await bcrypt.compare(password, user.password)
    //     if(!valid) throw new Error('Invalid Password!')
    //     // generate the jwt token
    //     const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    //     // set the cookie with token
    //     ctx.response.cookie('token', token, {
    //         httpOnly: true,
    //         maxAge: 1000 * 60 * 60 * 24 * 365,  // 1 year cookie
    //     })
    //     // return the user
    //     return user
    // },

    // signout(parent, args, ctx, info) {
    //     ctx.response.clearCookie('token')
    //     return { message: 'Goodbye!'}
    // },

    // async requestReset(parent, args, ctx, info) {
    //     // Check if this is a real user
    //     const user = await ctx.db.query.user({
    //         where: {
    //             email: args.email
    //         }
    //     })
    //     if(!user) throw new Error(`No such User found for email ${email}`)
    //     // Set a reset token and sxpriry on that user
    //     const resetToken = (await promisify(randomBytes)(20)).toString('hex')
    //     const resetTokenExpiry = Date.now() + 3600000  // 1hour from now
    //     const res = await ctx.db.mutation.updateUser({
    //         where: { email: args.email },
    //         data: { resetToken, resetTokenExpiry }
    //     })
    //     // Email them that reset token
    //     const mailRes = await transport.sendMail({
    //         from: 'hugo@example.com',
    //         to: user.email,
    //         subject: 'Your Password Reset Token',
    //         html: makeANiceEmail(`Your Password Reset Token is here! \n\n <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click Here to Reset</a>`)
    //     })

    //     // Return the message
    //     return { message: 'Good!'}
    // },

    // async resetPassword(parent, args, ctx, info) {
    //     // Check if the password match
    //     if(args.password !== args.confirmPassword) {
    //         throw new Error(`Password do not match!`)
    //     }
    //     // Check if it is a legit resetToken
    //     // Check if it is expired
    //     const [user] = await ctx.db.query.users({  // unique field以外の条件検索紹介
    //         where: {
    //             resetToken: args.resetToken,
    //             resetTokenExpiry_gte: Date.now() - 3600000
    //         }
    //     }) 
    //     if(!user){
    //         throw new Error(`This token is either invalid or expired`)
    //     }
    //     // Hash their new password
    //     const password = await bcrypt.hash(args.password, 10)
    //     // Save the new password to the user and remove old resetToken fields
    //     const updatedUser = await ctx.db.mutation.updateUser({
    //         where: { email: user.email },
    //         data: {
    //             password,
    //             resetToken: null,
    //             resetTokenExpiry: null
    //         }
    //     })
    //     // Generate JWT
    //     const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET)
    //     // Set the JST cookie
    //     ctx.response.cookie('token', token, {
    //         httpOnly: true,
    //         maxAge: 1000 * 60 * 60 * 24 * 365,  // 1 year cookie
    //     })
    //     // Return new User
    //     return updatedUser
    // },

    // async updatePermissions(parent, args, ctx, info) {
    //     // 1. Check if they are logged in
    //     if (!ctx.request.userId) {
    //         throw new Error('You must be logged in!');
    //     }
    //     // 2. Query the current user
    //     const currentUser = await ctx.db.query.user(
    //     {
    //         where: {
    //         id: ctx.request.userId,
    //         },
    //     },
    //     info
    //     );
    //     // 3. Check if they have permissions to do this
    //     hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);
    //     // 4. Update the permissions
    //     return ctx.db.mutation.updateUser(
    //     {
    //         data: {
    //         permissions: {
    //             set: args.permissions,
    //         },
    //         },
    //         where: {
    //         id: args.userId,
    //         },
    //     }, info );
    // },

    // async addToCart(parent, args, ctx, info) {
    //     // Make sure the are signed in
    //     const { userId } = ctx.request
    //     if(!userId) throw new Error('You must be signed in soooooooon!');
    //     // Query the users current cart
    //     const [ existingCartItem ] = await ctx.db.query.cartItems({
    //         where: {
    //             user: {
    //                 id: userId
    //             },
    //             item: { 
    //                 id: args.id 
    //             }
    //         }
    //     })
    //     // Check if that item is already in their cart and increment by 1 if it is
    //     if(existingCartItem){
    //         return ctx.db.mutation.updateCartItem({
    //             where: { id: existingCartItem.id },
    //             data: { quantity: existingCartItem.quantity + 1 }
    //         }, info)
    //     }    
    //     // If it is not, create a fresh CartItem for that User
    //     return ctx.db.mutation.createCartItem({
    //         data: {
    //             user: {
    //                 connect: {
    //                     id: userId
    //                 }
    //             },
    //             item: {
    //                 connect: {
    //                     id: args.id
    //                 }
    //             }
    //         }
    //     }, info)
    // },

    // async removeFromCart(parent, args, ctx, info) {
    //     // Find the cart item
    //     const cartItem = await ctx.db.query.cartItem({
    //         where: {
    //             id: args.id
    //         }
    //     }, `{ id, user { id }}`)
    //     // make sure we found an item
    //     if(!cartItem) throw new Error('No CartItem Found!')
    //     // make sure they own that cart item
    //     if(cartItem.user.id !== ctx.request.userId) throw new Error('Cheating huhhhh')
    //     // delete that cart item
    //     return ctx.db.mutation.deleteCartItem({
    //         where: {
    //             id: args.id
    //         }
    //     }, info)
    // },

    // async createOrder(parent, args, ctx, info) {
    //     // Query the current user and make sure they are signed in
    //     const { userId } = ctx.request
    //     if(!userId) throw new Error('You must be signed in to complete this order.');
    //     const user = await ctx.db.query.user({
    //         where: {
    //             id: userId 
    //         }}, `{
    //                 id
    //                 name 
    //                 email 
    //                 cart { 
    //                     id 
    //                     quantity 
    //                     item { 
    //                         title 
    //                         price 
    //                         id 
    //                         description 
    //                         image
    //                         largeImage
    //                     }
    //                 }
    //             }`
    //         )
    //     // Recalculate the total for the Price (UI側でJavascriptをいじって金額を改ざんされた場合の対処)
    //     const amount = user.cart.reduce(
    //         (tally, cartItem) => tally + cartItem.item.price * cartItem.quantity,
    //         0
    //     );
    //     console.log(`Going to charge for a total of ${amount}`);
    //     // Create the stripe change (turn token into Money!!!)
    //     const charge = await stripe.charges.create({
    //         amount,
    //         currency: 'USD',
    //         source: args.token
    //     })
    //     // Convert the CartItems to OrderItems
    //     const orderItems = user.cart.map(cartItem => {
    //         const orderItem = {
    //             ...cartItem.item,
    //             quantity: cartItem.quantity,
    //             user: {
    //                 connect: {
    //                     id: userId
    //                 }
    //             },
    //         }; 
    //         delete orderItem.id;
    //         return orderItem
    //     })
    //     // Create the Order
    //     const order = await ctx.db.mutation.createOrder({
    //         data: {
    //             total: charge.amount,
    //             charge: charge.id,
    //             items: { create: orderItems },  // Prisma が自動でOrderItem typeのデータを作成してくれる
    //             user: { connect: { id: userId } },
    //         }
    //     }) // そのまんまのerror内容をUIに表示したくない場合は、.catchでエラーをthrowしてやればよい
    //     // Clean up - clearn the users cart, delete cartItems
    //     const cartItemIds = user.cart.map(cartItem => cartItem.id)
    //     await ctx.db.mutation.deleteManyCartItems({
    //         where: {
    //             id_in: cartItemIds
    //         }
    //     })
    //     // Return the Order to the client
    //     return order
    // },

};

module.exports = Mutations;
