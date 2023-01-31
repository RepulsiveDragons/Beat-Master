//store all the data into one object
const defaultData = {
    "highscore": 0, 
},
  storeName = "js9452-p2-highscore";
  
  //read the data from the object
  const readLocalStorage = () => {
    let allValues = null;
  
    try{
      allValues = JSON.parse(localStorage.getItem(storeName)) || defaultData;
    }catch(err){
      console.log(`Problem with JSON.parse() and ${storeName} !`);
      throw err;
    }
  
    return allValues;
  };
  
  //write data to the object
  const writeLocalStorage = (allValues) => {
    localStorage.setItem(storeName, JSON.stringify(allValues));
  };
  
  //clears local storage
  export const clearLocalStorage = () => {
    writeLocalStorage(defaultData);
  }

  //check to see if a new high score was reached
  export const checkIfHighScore = score =>{
    const allValues = readLocalStorage();
    if(score > allValues.highscore) allValues.highscore = score;
    writeLocalStorage(allValues);
  }

  //get current high score
  export const getHighScore = () => readLocalStorage().highscore;