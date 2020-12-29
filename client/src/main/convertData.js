export default ()=>{
    // converting setup numbers into skins names
    
    for(const part_with_s_ending in window.customize_skins_setup){
      const part = part_with_s_ending.slice(0,-1); 
    
    window.customize_skins_setup[part_with_s_ending]
      .forEach(skinObject=>{
        skinObject.skin = part+"_"+skinObject.skin
      });
    
      }
        
        // converting skin numbers into full name strings
        Object.keys(window.progress.skins).forEach((item) => {
          window.progress.skins[item].forEach((skin_number, index, array) => {
            array[index] = item.substring(0, item.length - 1) + "_" + skin_number
          })
        })
    
    
    //converting map names into array in a certain order 
    function convertLevelToScore(not_converted){
      const {difficulty,name} = not_converted.info
      const level = window.progress.levels_scores.find(level=>level.level === `${difficulty}-${name}`)
      let score = -1;
      if(level) score = level.score
      return score // level?.score || -1
    }
    window.progress.levels_scores = levelsConfiguration
    .map(not_converted_level=> not_converted_level = convertLevelToScore(not_converted_level))
    
    /*
    window.progress.levels_scores = [0]
    for(let i=0;i<70;i++){
        window.progress.levels_scores.push(1)
    }
*/
   

      }