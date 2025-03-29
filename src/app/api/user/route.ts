import { db } from '@/db';
import { hash } from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(request:Request) {
    try {
        const { name, email, password } = await request.json();

        

        // Check if the user already exists
        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ message: "User with this email already exists." }, { status: 409 });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await hash(password, saltRounds);

        // Create the new user
        const newUser = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return NextResponse.json(
            { message: "User created successfully.", user: newUser },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}
export const GET = async(request:Request) => {
    try {
        const user = await db.user.findMany({
            orderBy:{
                createdAt:'desc' //latest user
            },
            
        });
       
        return NextResponse.json(user);
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to fetch the user"

        },{
            status:500
        }
    )
    }
}