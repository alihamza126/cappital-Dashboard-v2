import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    sidebarToggle: false,
    };

const sidebarToggleSlice = createSlice({
    name: 'sidebarToggle',
    initialState,
    reducers: {
        setSidebarToggle(state, action) {
            state.sidebarToggle = action.payload;
        },
    },
});

export const { setSidebarToggle } = sidebarToggleSlice.actions;
export default sidebarToggleSlice.reducer;