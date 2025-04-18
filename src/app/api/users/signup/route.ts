import {connectDb} from '@/dbConnection/dbConfig'
import User from '@/models/user.model'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { sendEmail } from '@/helpers/mailer'


connectDb()


export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {username, email, password} =  reqBody
        // validation
        console.log(reqBody);
        
        const user = await User.findOne({email})

        if(user){
            return NextResponse.json({message: "User already exists"}, {status: 400})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const nerUser = new User({
            username,
            email,
            password: hashedPassword
        })

        const savedUser = await nerUser.save()
        console.log(savedUser);
        
        // sned verification email

        await sendEmail({email, emailType: "VERIFY", userId: savedUser._id})

        return NextResponse.json({message: "User created successfully", savedUser}, {status: 201})

    } catch (error: any) {
        console.log(`Something went wrong in POST request: ${error}`);
        return NextResponse.json({message: "Something went wrong"}, {status: 500})
    }
    
}