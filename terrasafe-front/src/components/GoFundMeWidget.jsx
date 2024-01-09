import React, { useEffect } from 'react';

const GoFundMeWidget = () => {
    useEffect(() => {
        // Function to dynamically load the GoFundMe script
        const loadScript = () => {
            const script = document.createElement('script');
            script.src = "https://www.gofundme.com/static/js/embed.js";
            script.defer = true;
            document.body.appendChild(script);
        };

        loadScript();
    }, []);

    return (
        <div 
            className="gfm-embed" 
            data-url="https://www.gofundme.com/f/test-for-project-school-dont-donate/widget/large?sharesheet=firstTime"
            dangerouslySetInnerHTML={{ __html: "" }} // The div itself doesn't have inner HTML, but the script works on this div
        />
    );
};

export default GoFundMeWidget;