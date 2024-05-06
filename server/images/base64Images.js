const fs = require('fs');
const categoriesObject=[{CAT_ID:2, CAT_NAME:"BREADS",image_file:"breads.jpg"},
                        {CAT_ID:3, CAT_NAME:"CEREALS",image_file:"cereals.jpg"},
                        {CAT_ID:4, CAT_NAME:"CHACOLATES",image_file:"chacolates.jpg"},
                        {CAT_ID:5, CAT_NAME:"FRUITS",image_file:"fruits.jpg"},
                        {CAT_ID:6, CAT_NAME:"JUICES",image_file:"juices.jpg"},
                        {CAT_ID:7, CAT_NAME:"MEAT",image_file:"meat.jpg"},
                        {CAT_ID:8, CAT_NAME:"MILK",image_file:"milk.jpg"},
                        {CAT_ID:1, CAT_NAME:"VEGETABLES",image_file:"vegetables.jpg"},
                        ];

function imageToBase64Sync(filePath) {
    // Read the image file synchronously
    const imageBuffer = fs.readFileSync(filePath);

    // Convert the image buffer to a Base64 string
    const base64Image = imageBuffer.toString('base64');

    // Optional: Create a data URI, useful if you need to embed the image directly in web pages or CSS files
    const mimeType = getMimeType(filePath); // Determine the MIME type based on the file extension
    const dataUri = `data:${mimeType};base64,${base64Image}`;

    return dataUri;
}

function getMimeType(filePath) {
    // Extract the file extension and determine the MIME type
    const extension = filePath.split('.').pop().toLowerCase();
    switch (extension) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        case 'gif':
            return 'image/gif';
        default:
            return 'application/octet-stream'; // Default MIME type for unknown files
    }
}
const getDetails=(CAT_ID)=>{
    for(let category of categoriesObject){
        if(category.CAT_ID==CAT_ID){
            const categoryName=category.CAT_NAME;
            const fileName=category.image_file;
            const result=imageToBase64Sync(`../../images/${fileName}`);
            // console.log(result)
            return {CAT_NAME:categoryName,base64Image:result}
        }
    }
}
module.exports={getDetails}


