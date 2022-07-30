import React from 'react';
import DraggableList from '../widgets/draggableList/DraggableList.tsx';
import TeamWithFlag from '../widgets/TeamWithFlag.tsx';


function RanksView({
    count,
}){
    return (
        <div className="">
            {[...Array(count).keys()].map(index =>(
                <div key={index} style={{
                    height: 36,
                    width: 40,
                    marginTop: 6,
                    marginBottom: 6,
                }}>
                    <span style={{fontSize: 24, lineHeight: 1.5}}>
                        {index + 1}.
                    </span>
                </div>
            ))}
        </div>
    );
}

function TeamStanding({
    crest_url,
    name,
}){
    return (
        <div className="team_row bg-info" style={{
            padding: 8,
            width: '100%'
        }}>
            <TeamWithFlag name={name} crest_url={crest_url} />
        </div>
    );
}

function DraggableStandings({
    items,
    setItems,
}){
    return (
        <div className='DraggableStandings'>
            <RanksView count={items.length} />
            <div style={{flex: '1 auto'}}>
                <DraggableList
                    items={items}
                    setItems={setItems}
                    Component={TeamStanding}
                />
            </div>
        </div>
    );
} 

export default DraggableStandings;