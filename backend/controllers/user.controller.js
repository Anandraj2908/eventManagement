import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from '../models/user.model.js';
import jwt from "jsonwebtoken"


const generateAccessAndRefreshTokens = async(userId) => {
    try{
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    }
    catch(error){
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}



const registerUser = asyncHandler(async (req, res) => {
    try{
        const {fullName, username, password} = req.body;

        if([fullName, username, password].some((field) => field?.trim() === "")){
            throw new ApiError(400, "All fields are required")
        }

        const existedUser = await User.findOne({username});

        if(existedUser){
            throw new ApiError(409, "User with same username already exists")
        }

        const user = await User.create({
            fullName,
            password,
            username: username.toLowerCase(),
        })

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )

        if(!createdUser){
            throw new ApiError(500, "Something went wrong while creating user")
        }

        return res.status(201).json(
            new ApiResponse(200, createdUser, "User created successfully")
        )
    }catch(error){
        return res.status(error.statusCode).json(new ApiResponse(error.statusCode,[],error.message))
    }
})

const loginUser = asyncHandler( async (req, res) => {
    try{
        const {username, password} = req.body;

        if(! username){
            throw new ApiError(400, "username is required")
        }

        const user = await User.findOne({username});

        if(!user){
            throw new ApiError(404," Invalid user credentials")
        }

        const isPasswordValid = await user.isPasswordCorrect(password)
        if(!isPasswordValid){
            throw new ApiError(404," Invalid user credentials")
        }

        const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);
        
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken",refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user:loggedInUser,accessToken,refreshToken
                },
                "User loggedin successfully"
            )
        )
    }catch(error){
        return res.status(error.statusCode).json(new ApiResponse(error.statusCode,[],error.message))
    }
})

const logoutUser = asyncHandler(async (req,res) => {
    try{
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset:{
                    refreshToken:1 
                },
                
            },
            {
                new:true
            }
        )

        const options = {
            httpOnly: true,
            secur: true
        }

        return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200,[],"User logged Out"))
    }catch(error){
        console.log(error)
        return res.status(error.statusCode).json(new ApiResponse(error.statusCode,[],error.message))
    }

})


export { 
    registerUser,
    loginUser,
    logoutUser
};