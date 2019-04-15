const { forwardTo } = require('prisma-binding')
const { hasPermission } = require('../utils')


const Query = {

    // items: forwardTo('db'), // 特に操作が必要ないので、直接prismaにつっこんでいる
    // item: forwardTo('db'),  // 特に操作が必要ないので、直接prismaにつっこんでいる
    // itemsConnection: forwardTo('db'),  // 特に操作が必要ないので、直接prismaにつっこんでいる
    // async items(parent, args, ctx, info){
    //     const items = await ctx.db.query.items()
    //     return items
    // }

    //とりあえず
    users: forwardTo('db'),
    threads: forwardTo('db'),
    comments: forwardTo('db'),

    me(parent, args, ctx, info) {
        console.log('me query!');
        // check if there is a current user id (middlewareでuserIdがrequestに付加されているかチェック)
        if(!ctx.request.userId){
            return null
        }
        return ctx.db.query.user({
            where: {
                id: ctx.request.userId
            }
        }, info)
    },

    // async users(parent, args, ctx, info){
    //     // Check if they are logged in
    //     if(!ctx.request.userId){
    //         throw new Error('You must be logged in!')
    //     }
    //     console.log(ctx.request.user);
        
    //     // Check if the user has the permission to query all the users
    //     hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE'])
    //     // If they do, query all the users
    //     return ctx.db.query.users({}, info)
    // },

    // async order(parent, args, ctx, info){
    //     // Make sure they are logged in 
    //     if(!ctx.request.userId) throw new Error('You must be logged in!')
    //     // Query the current order
    //     const order = await ctx.db.query.order({
    //         where: { id: args.id }
    //     }, info)
    //     // Check if they have the permissions to see this order
    //     const ownsOrder = order.user.id === ctx.request.userId
    //     const hasPermissionToSeeOrder = ctx.request.user.permissions.includes('ADMIN')
    //     if(!ownsOrder || !hasPermissionToSeeOrder) {
    //         throw new Error('You cant see this!')
    //     }
    //     // Return the order
    //     return order
    // },

    // async orders(parent, args, ctx, info){
    //     const { userId } = ctx.request
    //     if(!userId) throw new Error('You must be signed in!')
    //     return ctx.db.query.orders({
    //         where: {
    //             user: { id: userId }
    //         }
    //     }, info)
    // },

};

module.exports = Query;
