import {connectDb} from '@/dbConnection/dbConfig'
import User from '@/models/user.model'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

connectDb()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {email, password} =  reqBody
        // validation
        console.log(reqBody);
        
        const user = await User.findOne({email})

        if(!user){
            return NextResponse.json({message: "User not found"}, {status: 400})
        }

        const validPassword = await bcrypt.compare(password, user.password)

        if(!validPassword){
            return NextResponse.json({message: "Invalid credentials"}, {status: 400})
        }

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }

        const token = await jwt.sign(tokenData, process.env.JWT_SECRET!, { expiresIn: '1d' })
        
        const response = NextResponse.json({
            message: "Login successful",
            success: true
        }, {status: 200})

        response.cookies.set('token', token, { httpOnly: true})

        return response
        

    } catch (error: any) {
        console.log(`Something went wrong in POST request: ${error}`);
        return NextResponse.json({message: "Something went wrong"}, {status: 500})
    }
    
}