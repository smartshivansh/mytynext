import apis from '@/pages/home/constants/apis';
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';



export const bookLinkSlice = createSlice({
    name: "bookLink",
    initialState: {
        linkType: "",
        linkSubType: "",
        userData: {
            name: "",
            email: ""
        }
    },
    reducers: {
        setLinkType: (state, action)=>{
            state.linkType = action.payload;
        },
        setLinkSubType: (state, action)=>{
            state.linkSubType = action.payload;
        },
        setUserData: (state, action)=>{
            state.userData = action.payload;
        }
    }
})