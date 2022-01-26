import * as React from 'react'
import {Button, View, Platform} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'

export default class PickImage extends React.Component{
    render(){
        return(
            <View style = {{felx:1, alignItems:'center', justifyContent:'center'}}>
                <Button
                title = 'Pick an Image From Gallary'
                onPress = {this.pickImage}>

                </Button>
            </View>
        )
    }

    getPermission = async() => {
        if(Platform.OS != 'web'){
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if(status != 'granted'){
                alert('Sorry, we need camera permission.')
            }
        }
    }

    componentDidMount(){
        this.getPermission()
    }

    pickImage = async() => {
        try{
            var result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4,3],
                quality: 1
            })

            if(!result.cancelled){
                console.log('result uri == ', result.uri)
                this.uploadImage(result.uri)
            }

        }

        catch(error){
            console.log(error)
        }
    }

    uploadImage = async(uri) => {
        const data = new FormData()
        var fileName = uri.split('/')[uri.split('/').length - 1]
        var type = `image/${uri.split('.')[uri.split('.').length - 1]}`
        console.log(type, 'type of upload image')

        const file = {
            uri : uri,
            name : fileName,
            type : type
        }

        data.append('digit', file)
        fetch('http://dbde-2405-201-4012-703f-ed6d-89f1-24ab-9cb1.ngrok.io/predict',{
            method: 'POST',
            body : data,
            headers : {
                'content-type' : 'multipart/form-data'
            }
        })
        .then((response)=>{
            console.log('inside then!')
            return response.json()
            //to know if the api is successfully called
        })
        .then((result)=>{
            console.log('result success!', result)
            //the digit predicted
        })
        .catch((error)=>{
            console.log('error in upload image api', error)
            //any error
        })
    }
}