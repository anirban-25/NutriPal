import axios from 'axios'
import React from 'react'

export async function Transfer(file :File) {
    try {
        const result = await axios.post("http://localhost:5000/upload-files", file);
        console.log(result);
    } catch (error) {
        
    }
}