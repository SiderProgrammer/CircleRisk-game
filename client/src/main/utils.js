export default {
    convertLevelNumberToLevelName:function(level){
        const {difficulty,name} = level.info
        return `${difficulty}-${name}`
    }

    
}