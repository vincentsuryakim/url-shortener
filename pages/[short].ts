import prisma from "@/lib/prisma"
import { Link } from "@prisma/client";
import { NextPage, NextPageContext } from "next";

const Short: NextPage = () => null

export const getServerSideProps = async (ctx: NextPageContext) => {
    // Retrieve the short URL from the query string
    const { short } = ctx.query;

    let response: Link | null;
    try {
        // Find the record in the database
        response = await prisma.link.findUnique({
            where: {
                shortUrl: short as string
            }
        })

    } catch (err: any) {
        // If there's an error, redirect to the home page
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    // If no record is found, redirect to the home page
    if (!response) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    // If a record is found, get the long URL into a variable
    let longUrl = response.longUrl;

    // If the long URL doesn't start with http, add it
    if (!longUrl.startsWith('http')) {
        longUrl = `http://${longUrl}`;
    }

    // Redirect to the long URL
    return {
        redirect: {
            destination: longUrl,
            permanent: false
        }
    }
}

export default Short