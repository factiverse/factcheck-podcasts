import React from 'react';

export default function ChannelCard({channel}) {
  return (
    <div className="card col">
      <div className="card-body">
        {channel.title}
      </div>
    </div>


  );

}