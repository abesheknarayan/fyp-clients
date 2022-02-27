import React,{ useEffect, useState } from "react";
import { Button, Input } from '@chakra-ui/react';

function Field(props) {
    const [attributeName, setAttributeName] = useState(props.value ? props.value : '');
    console.log("rendering field",attributeName);

    const handleAttributeNameChange = (e) => {
        setAttributeName(e.target.value);
        props.setFieldWithIndex({value:e.target.value,type:"string"},props.index);
    }

    const handleDeleteAttribute = () => {
        props.removeFieldWithIndex(props.index);
    }

    useEffect(()=>{
        setAttributeName(props.value)
    },[props.value])


    return (
        <React.Fragment>
            <Input placeholder="Attribute" value={attributeName} onInput={handleAttributeNameChange} />
            {props.delete && <Button onClick={handleDeleteAttribute} colorScheme="red" > Delete </Button>
            }
        </React.Fragment>
    )
}

export default Field;