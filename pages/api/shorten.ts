import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import prisma from "@/lib/prisma";

const shorten = async (req: NextApiRequest, res: NextApiResponse) => {
    // Retrieve the request body
    const body = req.body;

    // Separate the long URL and short URL into variables
    const longUrl = body.longUrl;
    const shortUrl = body.shortUrl;

    try {
        // Create a new record in the database
        await prisma.link.create({
            data: {
                longUrl,
                shortUrl
            }
        })
    } catch (err: any) {
        // If the short URL already exists, return an error
        if (err instanceof PrismaClientKnownRequestError) {
            if (err?.code === 'P2002') {
                return res.status(400).json({ message: 'A record with this shortUrl already exists' })
            }
        }

        // If something else went wrong, return an error
        return res.status(400).json({ message: 'Something went wrong' })
    }
    
    // If everything went well, return a success message
    return res.status(200).send({ message: 'Successfully created short URL'})
}

export default shorten;