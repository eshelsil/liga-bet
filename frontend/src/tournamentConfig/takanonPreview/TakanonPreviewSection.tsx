import React from 'react';

function TakanonPreviewSection({children}){
	return (
		<div className='LigaBet-TakanonPreviewSection'>
			<h4 className='takanonDemoTitle'>איך זה יראה בתקנון:</h4>
			<div>
				{children}
			</div>
		</div>
	);
}


export default TakanonPreviewSection;