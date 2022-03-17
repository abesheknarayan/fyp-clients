import React, { useEffect, useState } from "react";
import { Button, Input, Flex } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

function Field(props) {
    const [attributeName, setAttributeName] = useState(props.value ? props.value : '');
    console.log("rendering field", attributeName);

    const handleAttributeNameChange = (e) => {
        setAttributeName(e.target.value);
        props.setFieldWithIndex({ value: e.target.value, type: "string" }, props.index);
    }

    const handleDeleteAttribute = () => {
        props.removeFieldWithIndex(props.index);
    }

    useEffect(() => {
        setAttributeName(props.value)
    }, [props.value])


    return (
        <React.Fragment>
            <Flex >
                <Input size='md' placeholder="Attribute" value={attributeName} onInput={handleAttributeNameChange} />
                {props.delete && <Button marginLeft={'2'} w='max-content' onClick={handleDeleteAttribute} colorScheme="red" > <DeleteIcon /> </Button>
                }
            </Flex>
        </React.Fragment>
    )
}

export default Field;