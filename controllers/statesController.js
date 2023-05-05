const data = {
        states: require('../model/statesData.json'),
        setStates: function (data) { this.states = data }
}

//GET ALL state data
const getAllStates = async (req, res) =>{
        const states = await State.find(); 
        if(!states) return res.status(404).json({'message': 'No states found.'});
        
        const result = [];

        if(req.query.contig != 'true') { 
                let match = false;
                for(let i = 0; i < data.length; i++){
                if(req.query.contig === 'false'){ 
                        if(data[i].code === "AK" || data[i].code === "HI"){

                        for(let j = 0; j < states.length; j++){
                            if(data[i].code === states[j].stateCode){ 
                                result.push({...data[i], funfacts: states[j].funfacts});
                                match = true;
                        }}
                if(!match) {
                        result.push({...data[i]});
                } match = false;
                        }
                } else {

                        for(let j = 0; j < states.length; j++) {
                                if(data[i].code === states[j].stateCode){
                                result.push({...data[i], funfacts: states[j].funfacts});
                                match = true;
                                } 
                        }
                        if(!match){
                                result.push({...data[i]});
                        }   
                        match = false;
                }
        }
        } 
        else 
        {
            let match = false;
            for(let i = 0; i < data.length; i++)
            {
                if(data[i].code !== "AK" && data[i].code !== "HI")
                {
                    for(let j = 0; j < states.length; j++)
                    {
                        if(data[i].code === states[j].stateCode)
                        { 
                            result.push({...data[i], funfacts: states[j].funfacts});
                            match = true;
                        } 
                    }
                    if(!match)
                    { 
                        result.push({...data[i]});
                    }   
                    match = false;
                } 
            }
        }

        res.json(result);
    }



//CREATE a new state fun fact
const createFunfact = async (req, res)=>{

        if(!req?.body?.funfacts || req?.body?.funfacts.length < 1)
        { //If there are no funfacts in body of the request.
            return res.status(400).json({'message': 'State fun facts value required'});
        }
    
        if(!Array.isArray(req?.body?.funfacts))
        { //If funfacts is NOT an array.
            return res.status(400).json({'message': 'State fun facts value must be an array'});
        }
    
        const state = req.params.state.toLowerCase();
    
        if(state != "al" && state != "ak" && state != "az" && state != "ar" && state != "ca" 
        && state != "co" && state != "ct" && state != "de" && state != "fl" && state != "ga"
        && state != "hi" && state != "id" && state != "il" && state != "in" && state != "ia"
        && state != "ks" && state != "ky" && state != "la" && state != "me" && state != "md"
        && state != "ma" && state != "mi" && state != "mn" && state != "ms" && state != "mo"
        && state != "mt" && state != "ne" && state != "nv" && state != "nh" && state != "nj"
        && state != "nm" && state != "ny" && state != "nc" && state != "nd" && state != "oh"
        && state != "ok" && state != "or" && state != "pa" && state != "ri" && state != "sc"
        && state != "sd" && state != "tn" && state != "tx" && state != "ut" && state != "vt"
        && state != "va" && state != "wa" && state != "wv" && state != "wi" && state != "wy")
        {
            return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
        } 
        else 
        { //If the statecode is valid:
            const states = await State.find(); //Retrieves all stateCodes and funfacts from MongoDB.
            let isInDB = false;
            //console.log(req.body.stateCode.toUpperCase());
            //console.log(req.params.state.toUpperCase());
            
            //Loops through each of the data in MongoDB
            for(let j = 0; j < states.length; j++)
            {
                if(req.params.state.toUpperCase() === states[j].stateCode)
                { //If the state is already in MongoDB, it does not need to be added.
                 
                    /*   if(req.body.stateCode.toUpperCase() !== req.params.state.toUpperCase()){ //If the state in the url is different than what state we want to add to, an error is output.
                        return res.json({'message': 'stateCode and url state must match'});
                    }*/
    
                    isInDB = true;      
                    states[j].funfacts = states[j].funfacts.concat(req.body.funfacts); //Appends the new funfacts to the current funfacts.  
                    const result = await states[j].save();
                    return res.json(result);
                } 
            }
            if(!isInDB)
            { //If the state is NOT in MongoDB, it must be added.
              
                /* if(req.body.stateCode.toUpperCase() !== req.params.state.toUpperCase()){ //If the state in the url is different than the body, an error is output.
                    return res.json({'message': 'stateCode and url state must match'});
                } */
                
                const result = await State.create({
                    stateCode: req.params.state.toUpperCase(),
                    funfacts: req.body.funfacts
                });
                return res.status(201).json(result);
            }
        }
    }


//UPDATE a state fun fact
const updateFunfact = async (req, res) =>{

        if(!req?.body?.index){ //If there is no index in body of the request.
            return res.status(400).json({'message': 'State fun fact index value required'});
        }
    
        if(typeof req?.body?.funfact !== 'string'){ //If funfact is NOT a string.
            return res.status(400).json({'message': 'State fun fact value required'});
        }
    
        const state = req.params.state.toLowerCase();
    
        if(state != "al" && state != "ak" && state != "az" && state != "ar" && state != "ca" 
        && state != "co" && state != "ct" && state != "de" && state != "fl" && state != "ga"
        && state != "hi" && state != "id" && state != "il" && state != "in" && state != "ia"
        && state != "ks" && state != "ky" && state != "la" && state != "me" && state != "md"
        && state != "ma" && state != "mi" && state != "mn" && state != "ms" && state != "mo"
        && state != "mt" && state != "ne" && state != "nv" && state != "nh" && state != "nj"
        && state != "nm" && state != "ny" && state != "nc" && state != "nd" && state != "oh"
        && state != "ok" && state != "or" && state != "pa" && state != "ri" && state != "sc"
        && state != "sd" && state != "tn" && state != "tx" && state != "ut" && state != "vt"
        && state != "va" && state != "wa" && state != "wv" && state != "wi" && state != "wy")
        {
            return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
        } 
        else 
        { 
            const states = await State.find(); 
    

            for(let j = 0; j < states.length; j++)
            {
                if(req.params.state.toUpperCase() === states[j].stateCode.toUpperCase())
                { 
                    if(states[j].funfacts.length < 1)
                    { 
                        for(let i = 0; i < data.length; i++)
                        {
                            if(states[j].stateCode.toUpperCase() === data[i].code.toUpperCase())
                            {
                                return res.status(400).json({'message': `No Fun Facts found for ${data[i].state}`});
                            }
                        }  
                    }
    
                    for(let e = 0; e < states[j].funfacts.length; e++)
                    {
                        if((e + 1) === req?.body?.index)
                        { 
                            states[j].funfacts[e] = req.body.funfact; 
                            const result = await states[j].save(); 
                            return res.json(result);
                        }
                    }
                    for(let i = 0; i < data.length; i++)
                    {
                        if(states[j].stateCode.toUpperCase() === data[i].code.toUpperCase())
                        {
                            return res.status(400).json({'message': `No Fun Fact found at that index for ${data[i].state}`});
                        }
                    }   
                } 
            }
            for(let i = 0; i < data.length; i++)
            {
                if(req.params.state.toUpperCase() === data[i].code.toUpperCase())
                {
                    return res.status(400).json({'message': `No Fun Facts found for ${data[i].state}`});
                }
            }  
        }
    }

//DELETE a state fun fact
const deleteFunFact = async (req, res) =>{

        if(!req?.body?.index) return res.status(400).json({'message': 'State fun fact index value required'});
    
        const state = req.params.state.toLowerCase();
    

        if(state != "al" && state != "ak" && state != "az" && state != "ar" && state != "ca" 
        && state != "co" && state != "ct" && state != "de" && state != "fl" && state != "ga"
        && state != "hi" && state != "id" && state != "il" && state != "in" && state != "ia"
        && state != "ks" && state != "ky" && state != "la" && state != "me" && state != "md"
        && state != "ma" && state != "mi" && state != "mn" && state != "ms" && state != "mo"
        && state != "mt" && state != "ne" && state != "nv" && state != "nh" && state != "nj"
        && state != "nm" && state != "ny" && state != "nc" && state != "nd" && state != "oh"
        && state != "ok" && state != "or" && state != "pa" && state != "ri" && state != "sc"
        && state != "sd" && state != "tn" && state != "tx" && state != "ut" && state != "vt"
        && state != "va" && state != "wa" && state != "wv" && state != "wi" && state != "wy")
        {
            return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
        } 
        else 
        { 

            const states = await State.find(); 
            let newFunfactArray = [];
    

            for(let j = 0; j < states.length; j++)
            {
                if(req.params.state.toUpperCase() === states[j].stateCode.toUpperCase())
                { 
                    if(states[j].funfacts.length < 1)
                    {
                        for(let i = 0; i < data.length; i++)
                        { 
                            if(states[j].stateCode.toUpperCase() === data[i].code.toUpperCase()) 
                                return res.status(400).json({'message': `No Fun Facts found for ${data[i].state}`});
                        }  
                    }
    
                    let indexFound = false;
    

                    for(let e = 0; e < states[j].funfacts.length; e++)
                    {
                        if((e + 1) === req?.body?.index)
                        {
                            indexFound = true;
                        }
                        else
                        { 
                            newFunfactArray.push(states[j].funfacts[e]); 
                    }
                    if(!indexFound)
                    { 
                        for(let i = 0; i < data.length; i++)
                        { 
                        if(states[j].stateCode.toUpperCase() === data[i].code.toUpperCase())
                            return res.status(400).json({'message': `No Fun Fact found at that index for ${data[i].state}`});
                        } 
                    }
                    else 
                    { 
                        states[j].funfacts = newFunfactArray;  
    
                        const result = await states[j].save(); 
                        return res.json(result);
                    }
                      
                } 
            } 
            for(let i = 0; i < data.length; i++)
            {
                if(state.toUpperCase() === data[i].code.toUpperCase()) 
                    return res.status(400).json({'message': `No Fun Facts found for ${data[i].state}`});
            }  
        }
        
    }
} 

//GET data for only ONE state
const getState = async (req, res) =>{
    
        if(!req?.params?.state)
        {
            return res.status(400).json({'message': 'State required'});
        } 
    
        const state = req.params.state.toLowerCase();
    
        if(state != "al" && state != "ak" && state != "az" && state != "ar" && state != "ca" 
        && state != "co" && state != "ct" && state != "de" && state != "fl" && state != "ga"
        && state != "hi" && state != "id" && state != "il" && state != "in" && state != "ia"
        && state != "ks" && state != "ky" && state != "la" && state != "me" && state != "md"
        && state != "ma" && state != "mi" && state != "mn" && state != "ms" && state != "mo"
        && state != "mt" && state != "ne" && state != "nv" && state != "nh" && state != "nj"
        && state != "nm" && state != "ny" && state != "nc" && state != "nd" && state != "oh"
        && state != "ok" && state != "or" && state != "pa" && state != "ri" && state != "sc"
        && state != "sd" && state != "tn" && state != "tx" && state != "ut" && state != "vt"
        && state != "va" && state != "wa" && state != "wv" && state != "wi" && state != "wy")
        {
            return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
        } 
        else 
        { 
            const states = await State.find(); 
            if(!states) return res.status(204).json({'message': 'No states found.'});
    
            for(let i = 0; i < data.length; i++)
            { 
                if(data[i].code.toLowerCase() == state)
                { 
                    
                    for(let j = 0; j < states.length; j++)
                    { 
                        if(data[i].code === states[j].stateCode)
                        { 
    
                            const result = { 
                                ...data[i],
                                funfacts: states[j].funfacts
                            }
                            return res.json(result);
                        } 
                    }
                    const result = {
                        ...data[i]
                    }
                    return res.json(result);
                } 
            }
        }
    }


//Return a state fun fact
const getFunfact = async (req, res) =>{

        if(!req?.params?.state)
        {
            return res.status(400).json({'message': 'State required'});
        } 
    
        let state = req.params.state.toLowerCase();
    
        if(state != "al" && state != "ak" && state != "az" && state != "ar" && state != "ca" 
        && state != "co" && state != "ct" && state != "de" && state != "fl" && state != "ga"
        && state != "hi" && state != "id" && state != "il" && state != "in" && state != "ia"
        && state != "ks" && state != "ky" && state != "la" && state != "me" && state != "md"
        && state != "ma" && state != "mi" && state != "mn" && state != "ms" && state != "mo"
        && state != "mt" && state != "ne" && state != "nv" && state != "nh" && state != "nj"
        && state != "nm" && state != "ny" && state != "nc" && state != "nd" && state != "oh"
        && state != "ok" && state != "or" && state != "pa" && state != "ri" && state != "sc"
        && state != "sd" && state != "tn" && state != "tx" && state != "ut" && state != "vt"
        && state != "va" && state != "wa" && state != "wv" && state != "wi" && state != "wy")
        {
            return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
        } 
        else 
        { //If the statecode is valid:
            state = state.toUpperCase();
            const stateInfo = await State.findOne({stateCode: `${state}`}); //Retrieves the stateCode and funfacts from MongoDB.
    
            for(let i = 0; i < data.length; i++)
            { //Loop through all the statesData.json
                if(data[i].code == state)
                { //If the state code matches the state parameter
                    if(stateInfo == null)
                    { //If the state is NOT located in MongoDB
                        return res.status(404).json({'message': `No Fun Facts found for ${data[i].state}`});
                    } 
                    else if(data[i].code === stateInfo.stateCode)
                    { //If the code from statesData matches stateCode from MongoDB.
                        const randomIndex = Math.floor(Math.random() * stateInfo.funfacts.length);    
                        const randomFact = stateInfo.funfacts[randomIndex];
                        const result = { //Sets a new object to the state's statesData data, plus the funfacts from MongoDB.
                            funfact: randomFact
                        }
                        return res.json(result);
                    }
                } 
            } 
        }
    }

//Return capital city of a specific state as requested
const getCapital = async (req, res) =>{

        if(!req?.params?.state){
            return res.status(400).json({'message': 'State required'});
        } 
    
        let state = req.params.state.toLowerCase();
    
        if(state != "al" && state != "ak" && state != "az" && state != "ar" && state != "ca" 
        && state != "co" && state != "ct" && state != "de" && state != "fl" && state != "ga"
        && state != "hi" && state != "id" && state != "il" && state != "in" && state != "ia"
        && state != "ks" && state != "ky" && state != "la" && state != "me" && state != "md"
        && state != "ma" && state != "mi" && state != "mn" && state != "ms" && state != "mo"
        && state != "mt" && state != "ne" && state != "nv" && state != "nh" && state != "nj"
        && state != "nm" && state != "ny" && state != "nc" && state != "nd" && state != "oh"
        && state != "ok" && state != "or" && state != "pa" && state != "ri" && state != "sc"
        && state != "sd" && state != "tn" && state != "tx" && state != "ut" && state != "vt"
        && state != "va" && state != "wa" && state != "wv" && state != "wi" && state != "wy")
        {
            return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
        } 
        else 
        { //If the statecode is valid:
            state = state.toUpperCase();
            
            for(let i = 0; i < data.length; i++)
            { //Loop through all the statesData.json
                if(data[i].code == state)
                { //If the state code matches the state parameter
                    const result = { //Sets a new object to the state's statesData data.
                        state: data[i].state,
                        capital: data[i].capital_city
                    }
                    return res.json(result);
                } 
            } 
        }
    }

//Return nickname of a specific  state
const getNickname = async (req, res) =>{

        if(!req?.params?.state)
        {
            return res.status(400).json({'message': 'State required'});
        } 
    
        let state = req.params.state.toLowerCase();
    
        if(state != "al" && state != "ak" && state != "az" && state != "ar" && state != "ca" 
        && state != "co" && state != "ct" && state != "de" && state != "fl" && state != "ga"
        && state != "hi" && state != "id" && state != "il" && state != "in" && state != "ia"
        && state != "ks" && state != "ky" && state != "la" && state != "me" && state != "md"
        && state != "ma" && state != "mi" && state != "mn" && state != "ms" && state != "mo"
        && state != "mt" && state != "ne" && state != "nv" && state != "nh" && state != "nj"
        && state != "nm" && state != "ny" && state != "nc" && state != "nd" && state != "oh"
        && state != "ok" && state != "or" && state != "pa" && state != "ri" && state != "sc"
        && state != "sd" && state != "tn" && state != "tx" && state != "ut" && state != "vt"
        && state != "va" && state != "wa" && state != "wv" && state != "wi" && state != "wy")
        {
            return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
        } 
        else 
        { //If the statecode is valid:
            state = state.toUpperCase();
    
            for(let i = 0; i < data.length; i++)
            { //Loop through all the statesData.json
                if(data[i].code == state)
                { //If the state code matches the state parameter
                    const result = { //Sets a new object to the state's statesData data.
                        state: data[i].state,
                        nickname: data[i].nickname
                    }
                    return res.json(result);
                } 
            } 
        }
    }

//Return the population of a speciric state
const getPopulation = async (req, res) =>{

        if(!req?.params?.state)
        {
            return res.status(400).json({'message': 'State required'});
        } 
    
        let state = req.params.state.toLowerCase();
    
        if(state != "al" && state != "ak" && state != "az" && state != "ar" && state != "ca" 
        && state != "co" && state != "ct" && state != "de" && state != "fl" && state != "ga"
        && state != "hi" && state != "id" && state != "il" && state != "in" && state != "ia"
        && state != "ks" && state != "ky" && state != "la" && state != "me" && state != "md"
        && state != "ma" && state != "mi" && state != "mn" && state != "ms" && state != "mo"
        && state != "mt" && state != "ne" && state != "nv" && state != "nh" && state != "nj"
        && state != "nm" && state != "ny" && state != "nc" && state != "nd" && state != "oh"
        && state != "ok" && state != "or" && state != "pa" && state != "ri" && state != "sc"
        && state != "sd" && state != "tn" && state != "tx" && state != "ut" && state != "vt"
        && state != "va" && state != "wa" && state != "wv" && state != "wi" && state != "wy")
        {
            return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
        } 
        else 
        { //If the statecode is valid:
            state = state.toUpperCase();
    
            for(let i = 0; i < data.length; i++)
            { //Loop through all the statesData.json
                if(data[i].code == state)
                { //If the state code matches the state parameter
                    const result = { //Sets a new object to the state's statesData data.
                        state: data[i].state,
                        population: data[i].population.toLocaleString("en-US")
                    }
                    return res.json(result);
                } 
            } 
        }
    }
    

//Return the US admission date of a specific state
const getAdmission = async (req, res) => {
        if(!req?.params?.state) {
                return res.status(400).json({'message': 'State required'});
        } 

        let state = req.params.state.toLowerCase();

        if(state != "al" && state != "ak" && state != "az" && state != "ar" && state != "ca" 
        && state != "co" && state != "ct" && state != "de" && state != "fl" && state != "ga"
        && state != "hi" && state != "id" && state != "il" && state != "in" && state != "ia"
        && state != "ks" && state != "ky" && state != "la" && state != "me" && state != "md"
        && state != "ma" && state != "mi" && state != "mn" && state != "ms" && state != "mo"
        && state != "mt" && state != "ne" && state != "nv" && state != "nh" && state != "nj"
        && state != "nm" && state != "ny" && state != "nc" && state != "nd" && state != "oh"
        && state != "ok" && state != "or" && state != "pa" && state != "ri" && state != "sc"
        && state != "sd" && state != "tn" && state != "tx" && state != "ut" && state != "vt"
        && state != "va" && state != "wa" && state != "wv" && state != "wi" && state != "wy") 
        {
                return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
        } else {
                state = state.toUpperCase();

                for(let i = 0; i < data.length; i++) { //Loop through all the statesData.json
                        if(data[i].code == state) { //If the state code matches the state parameter
                        const result = { //Sets a new object to the state's statesData data.
                                state: data[i].state,
                                admitted: data[i].admission_date.toLocaleString("en-US")
                        }
                                return res.json(result);
                        } 
                } 
        }
}





module.exports = {
        getAllStates,
        createFunfact,
        updateFunfact,
        deleteFunFact,
        getState,
        getFunfact,
        getCapital,
        getNickname,
        getPopulation,
        getAdmission
}