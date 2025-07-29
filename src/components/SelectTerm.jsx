import { useState } from 'react';

// prompt for year, semester
//  props
//  buttonText -- the text to display on a button
//  onClick -- the function to process a button click

function SelectTerm({ onClick, buttonText }) {

    const [term, setTerm] = useState({ year: '', semester: '' });

    const onChange = (e) => {
        setTerm({ ...term, [e.target.name]: e.target.value });
    }

    return (
        <>
            <div class="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <input id="year" type="text" name="year" value={term.year} placeholder="Year (e.g., 2024)" onChange={onChange} class="p-3 border border-[#4A7856] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8FC19E] focus:border-[#8FC19E] w-full sm:w-auto text-white placeholder-gray-400 bg-[#1A1F16]"/>
                <input id="semester" type="text" name="semester" value={term.semester} placeholder="Semester (e.g., Spring)" onChange={onChange} class="p-3 border border-[#4A7856] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8FC19E] focus:border-[#8FC19E] w-full sm:w-auto text-white placeholder-gray-400 bg-[#1A1F16]"/>
                <button id="selectTermButton" onClick={() => { onClick(term) }} class="px-6 py-3 bg-[#345830] text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#8FC19E] focus:ring-offset-2 transition duration-300 ease-in-out w-full sm:w-auto"> {buttonText} </button>
            </div>
        </>
    )

}

export default SelectTerm;