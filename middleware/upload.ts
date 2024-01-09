import path from "path";
import * as fs from "fs";


const saveImage = async (req: { body: { base64image: string } }, next: (error: Error) => void): Promise<string> => {
    try {
        const image: string = 'images/' + Date.now() + '.png';
        const pathFile: string = path.join(__dirname, '/../' + image);
        const imgdata: string = req.body.base64image;
        const base64Data: string = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');

        fs.writeFileSync(pathFile, base64Data, {encoding: 'base64'});

        return image;
    } catch (error) {
        console.log(error);
        next(error);
        throw error;
    }
};

export default saveImage;