export interface MetaWebhookBody{
    object:string,
    entry:MetaEntry[];
}
export interface MetaEntry{
    id: string,
    changes:MetaChange[];
}
export interface MetaChange{
    field : string
    value : MetaValue;
}
export interface MetaValue{
    messaging_product : string,
    metadata : MetaMetaData,

    contacts?: MetaContact[];
    messages?: MetaMessage[];
    statuses?:MetaStatus[];
}

export interface MetaMetaData{
    display_phone_number : string,
    phone_number_id : string,
}

export interface MetaContact{
    profile:{
        name:string,
    };

    wa_id:string;

}

export interface MetaMessage{
    from:string;

    id:string;
    
    time: string;

    timestamp: string;

    type: string;

    text?:{
        body:string;
    }; 
}

export interface MetaStatus{
    id:string;
    status:string;
    timestamp:string;

    recipient_id:string;
}