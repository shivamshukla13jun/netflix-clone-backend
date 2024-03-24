const axios=require("axios")
const API_BASE = 'https://api.jikan.moe/v4/anime';
const API_URL = process.env.NODE_ENV === 'development' ? API_BASE : API_BASE;

const Service = axios.create({
    baseURL: API_URL,
    headers: {
        Accept: 'application/json',
    },
});

Service.interceptors.request.use(
    config => {
       // if (accessToken) {
        //     config.headers.common = { Authorization: `Bearer ${accessToken}` };
        // }
        return config;
    },
    error => {
        Promise.reject(error.response || error.message);
    }
);

Service.interceptors.response.use(
    response => {
        return response;
    },
    error => {

        return Promise.reject(error.response || error.message);
    }
);



// Create function
const postApi = async(url,data) => {
    return new Promise(async(resolve, reject) => {
       await Service.post(url, data)
            .then(response => resolve(response.data))
            .catch(error => {
                console.error('Error creating item:', error);
                reject(error);
            });
    });
};

// Read function
const getApi =async (url) => {
    return new Promise(async(resolve, reject) => {
       await Service.get(url)
            .then(response => resolve(response.data))
            .catch(error => {
                console.error('Error fetching items:', error);
                reject(error);
            });
    });
};
const getApiByid =async (url,id) => {
    return new Promise(async(resolve, reject) => {
      await  Service.get(`${url}/${id}`)
            .then(response => resolve(response.data))
            .catch(error => {
                console.error('Error fetching items:', error);
                reject(error);
            });
    });
};

// Update function
const putApi = async(url,id, newData) => {
    return new Promise(async(resolve, reject) => {
       await Service.put(`${url}/${id}`, newData)
            .then(response => resolve(response.data))
            .catch(error => {
                console.error('Error updating item:', error);
                reject(error);
            });
    });
};

// Delete function
const deleteapi =async (url,id) => {
    return new Promise(async(resolve, reject) => {
       await Service.delete(`${url}/${id}`)
            .then(response => resolve(response.data))
            .catch(error => {
                console.error('Error deleting item:', error);
                reject(error);
            });
    });
};
module.exports= { getApi,getApiByid, postApi, putApi, deleteapi};
