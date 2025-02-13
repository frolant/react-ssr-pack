import type { EffectMiddleware } from 'redux-saga';

type TGetOnSagaActionMiddleware = (onSagaAction: (effect: any) => void) => EffectMiddleware;

export const getOnSagaActionMiddleware: TGetOnSagaActionMiddleware = (onSagaAction) => {
    return (next) => (effect) => {
        onSagaAction(effect);
        next(effect);
    };
};
