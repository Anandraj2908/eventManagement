import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: localStorage.getItem('accessToken') ? true : false, 
    userData: JSON.parse(localStorage.getItem('userData')) || null,
}
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        login: (state,action) => {
            state.status = true;
            state.userData = action.payload;
        },
        logout: (state, action) => {
            state.status = false;
            state.userData = null;
            localStorage.removeItem('accessToken');
        }
    }
})

export const {login, logout} = authSlice.actions;

export default authSlice.reducer;