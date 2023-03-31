import React from 'react';

function Footer() {
    return (
        <footer className="bg-gray-900 py-6">
            <div className="container mx-auto text-gray-400 text-sm flex justify-between items-center">
                <p>&copy; 2023 Youtility. All rights reserved.</p>
                <div className="flex">
                <a href="mailto:altamashattari786@gmail.com" className="mx-4 hover:text-gray-300">Contact us</a>
                </div>
            </div>
        </footer>

    )
}

export default Footer