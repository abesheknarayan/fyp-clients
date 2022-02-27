import React, { useEffect, useState } from "react";
import Field from "./Field";
import { Button, Input, useEditable } from '@chakra-ui/react';

// dynamic form used for attributes in creating credential schema
function Form() {
    const [fields, setFields] = useState([]);
    const [newAttribute, setNewAttribute] = useState('');
    console.log("rendering");


    const setFieldWithIndex = (value, index) => {
        setFields([...fields.slice(0, index), value, ...fields.slice(index + 1)])
    }


    const handleAddAttribute = () => {
        if (newAttribute.length) {
            setFields([...fields, { value: newAttribute, type: "string" }])
            setNewAttribute("")
        }
    }

    const handleNewAttributeNameChange = (e) => {
        setNewAttribute(e.target.value);
    }

    const removeFieldWithIndex = (index) => {
        setFields([...fields.slice(0, index), ...fields.slice(index + 1)]);
    }



    return (
        <React.Fragment>
            {fields.map((field, index) => <Field value={field.value} delete={true} removeFieldWithIndex={removeFieldWithIndex} setFieldWithIndex={setFieldWithIndex} type={field.type} index={index} key={index} ></Field>)}
            <Input placeholder="Attribute Name" value={newAttribute} onInput={handleNewAttributeNameChange}></Input>
            <Button onClick={handleAddAttribute} >Add</Button>
        </React.Fragment>
    )
}

export default Form;