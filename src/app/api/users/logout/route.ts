import {connectDb} from '@/dbConnection/dbConfig'
import { NextRequest, NextResponse } from 'next/server'

connectDb()

export async function POST(request: NextRequest){
    try {
        const response = NextResponse.json({
            message: "Logout successful",
            success: true
        }, {status: 200})

        response.cookies.set('token', "",{
            httpOnly: true,
            expires: new Date(0)
        })

        return response

    } catch (error:any) {
        console.log(`Something went wrong in POST request: ${error}`);
        return NextResponse.json({message: "Something went wrong"}, {status: 500})
    }
}