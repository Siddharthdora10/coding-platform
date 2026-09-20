const axios = require("axios");

const getLanguageById=(lang)=>{
    const language={
        "c++":54,
        "java":62,
        "javascript":63
    }

     return language[lang.toLowerCase()];

}

const submitBatch= async(submissions)=>{
      
 


    try {
  
       const response = await axios.post(
    `${process.env.JUDGE0_URL}/submissions/batch`,
    {
        submissions,
    },
    {
        params: {
            base64_encoded: false,
        },
        headers: {
            "Content-Type": "application/json",
        },
    }
);

return response.data;
    } catch (error) {
    console.error("Error while submitting batch:", error.message);
    throw error;
}
};


const submitToken = async (resultToken) => {
    try {
        const response = await axios.get(
            `${process.env.JUDGE0_URL}/submissions/batch`,
            {
                params: {
                    tokens: resultToken.join(","),
                    base64_encoded: false,
                    fields: "*",
                },
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error while fetching result:", error.message);
        throw error;
    }
};

module.exports = {
    getLanguageById,
    submitBatch,
    submitToken
};