// example of custom module 
 const gfName = "MrsRandom";
 
 const gfName2 = "MrsRandom2";
 export const gfName3 = "MrsRandom3";
 export default gfName;
 export {gfName2};

 export const lovePercent = ()=>{
    console.log("love percent function is getting called");
    return Math.floor(Math.random()*100);
 }

// module.exports = gfName;