import React from 'react';
import AutosuggestInput from '../components/AutosuggestInput';

const data = [
    {
        "_id": "64f75284ef8f606073e981e9",
        "province": "antananarivo",
        "region": "analamanga",
        "district": "antananarivo renivohitra",
        "commune": "1er arrondissement"
    },
    {
        "_id": "64f75284ef8f606073e98215",
        "province": "antananarivo",
        "region": "analamanga",
        "district": "antananarivo renivohitra",
        "commune": "2e arrondissement"
    },
    {
        "_id": "64f75284ef8f606073e9822d",
        "province": "antananarivo",
        "region": "analamanga",
        "district": "antananarivo renivohitra",
        "commune": "3e arrondissement"
    },
    {
        "_id": "64f75284ef8f606073e9824f",
        "province": "antananarivo",
        "region": "analamanga",
        "district": "antananarivo renivohitra",
        "commune": "4e arrondissement"
    },
    {
        "_id": "64f75284ef8f606073e9826f",
        "province": "antananarivo",
        "region": "analamanga",
        "district": "antananarivo renivohitra",
        "commune": "5e arrondissement"
    },
    {
        "_id": "64f75284ef8f606073e9828a",
        "province": "antananarivo",
        "region": "analamanga",
        "district": "antananarivo renivohitra",
        "commune": "6e arrondissement"
    },
    {
        "_id": "64f75284ef8f606073e982a9",
        "province": "antananarivo",
        "region": "analamanga",
        "district": "antananarivo avaradrano",
        "commune": "alasora"
    }
];

function TestApp() {
  return (
    <div className="TestApp">
      <h1>AutoSuggest Example</h1>
      <AutosuggestInput data={data} />
    </div>
  );
}

export default TestApp;
