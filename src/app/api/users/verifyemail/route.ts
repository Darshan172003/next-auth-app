import {connectDb} from '@/dbConnection/dbConfig'
import User from '@/models/user.model'
import { NextRequest, NextResponse } from 'next/server'


connectDb()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {token} =  reqBody
        console.log(token);
        
        const user = await User.findOne({verifyToken: token, verifTokenExpiry: {$gt: Date.now()}})  // $gt is a comparison operator that checks if the value is greater than the specified value

        if(!user){
            return NextResponse.json({message: "Invalid or expired token"}, {status: 400})
        }
        console.log(user);

        user.isVerified = true
        user.verifyToken = undefined
        user.verifTokenExpiry = undefined

        await user.save()

        return NextResponse.json({message: "Email verified successfully", success:true}, {status: 200})
        
    } catch (error: any) {
        console.log(`Something went wrong in POST request: ${error}`);
        return NextResponse.json({message: "Something went wrong"}, {status: 500})
    }
}