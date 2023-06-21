const serverConfig = {
    host: '0.0.0.0',
    devServerMaxTimeout: 120,
    devServerPort: 3000,
    serverSideRenderingPort: 3001
};

const getOutputGroupName = ({ chunk: { idNameHints, name } }) => [...idNameHints][0] || name || 'ungrouped';

const getOutputScriptFileName = (data, type, isServerSideRendering) => {
    return isServerSideRendering ? '[name].js' : `scripts/${getOutputGroupName(data)}.${type}.[id].js`;
};

module.exports = ({
    getOutputScriptFileName,
    getOutputGroupName,
    serverConfig
});
