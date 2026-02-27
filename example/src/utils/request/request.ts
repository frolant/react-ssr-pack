type TRequest = (url: string) => Promise<any>;

const request: TRequest = async (url) => {
    try {
        const response = await fetch(`${__HOST__}${url}`);
        !response.ok && console.error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export default request;
