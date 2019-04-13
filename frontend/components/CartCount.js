import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import styled from 'styled-components';

const AnimationStyles = styled.span`
    position: relative;
    .count {
        display: block;
        position: relative;
        transition: all .4s;
        backface-visibility: hidden;
    }
    /* Initial state of the entered Dot */
    .count-enter {
        transform: scale(4) rotateX(0.5turn);
    }
    /* End state of the entered Dot */
    .count-enter-active {
        transform: rotateX(0);
    }
    /* Initial state of the leaving Dot */
    .count-exit {
        top: 0;
        position: absolute;
        transform: rotateX(0);
    }
    /* End state of the leaving Dot */
    .count-exit-active {
        transform: scale(4) rotateX(0.5turn);
    }
`

const Dot = styled.div`
    background: ${props => props.theme.red};
    color: white;
    border-radius: 50%;
    padding: 0.5rem;
    line-height: 2rem;
    min-width: 3rem;
    margin-left: 1rem;
    font-weight: 100;

    /* 以下の二つは、1 や 2 のように文字として幅が異なる場合も同じ width を確保するようにするもの */
    font-feature-settings: 'tnum';
    font-variant-numeric: tabular-nums;
`

/**
 *  { count } が変更されるたびに、CartCountはremountされる
 *  コンポーネントがremountされる度にアニメーション => react-transition-group
 *  New Component => Animate In
 *  Old Component => Animate Out
 *  コンポーネントがremountされる際に、Old one と New one がtimeoutで指定した時間だけ共存する
 *  Old one と New one に それぞれ新しいクラスが付与される
 */
const CartCount = ({ count }) => (
    <AnimationStyles>    
        <TransitionGroup>
            <CSSTransition
                unmountOnExit
                className="count"
                classNames="count"
                key={count}
                timeout={{
                    enter: 400,
                    exit: 400
                }}
            >
                <Dot>{count}</Dot>
            </CSSTransition>
        </TransitionGroup>
    </AnimationStyles>
)

export default CartCount;