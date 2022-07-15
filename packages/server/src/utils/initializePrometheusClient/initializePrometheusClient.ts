import prometheusClient from 'prom-client';

type TInitializePrometheusClient = () => prometheusClient.Registry;

export const initializePrometheusClient: TInitializePrometheusClient = () => {
    const register = new prometheusClient.Registry();

    register.setDefaultLabels({
        app: 'server-side-rendering-app'
    });

    prometheusClient.collectDefaultMetrics({
        register
    });

    return register;
};
