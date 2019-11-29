import React, { Component } from 'react';
import {Grid, Image, Label, Button, Container, Input, Segment, List, Confirm, Icon} from 'semantic-ui-react';
import './main.css'

import TimePicker from 'react-time-picker';

class Main extends Component {
    constructor() {
        super();
        this.state = {
            mapImage: 'https://react.semantic-ui.com/images/wireframe/image.png',
            mapImageTemp: '',
            safeDistance: 10,
            active: true,
            SOC: "23",
            SOC2: "123123",
            TDT: "powi0",
            openOverrideDialogue: false,
            allowOverride: false,
            time: '10:00',
            frequency: 0,

        }
        this.readFile = this.readFile.bind(this)
    }

    readFile = file => {
        return new Promise(resolve => {
          const reader = new FileReader()
          reader.addEventListener('load', () => resolve(reader.result), false)
          reader.readAsDataURL(file)
        })
    }

    handleImageChange = async e => {
        const imageDataUrl = await this.readFile(e.target.files[0])
        this.setState({
          mapImageTemp: imageDataUrl
        })
    }

    handleChange = () => {
        this.setState({
            mapImage: this.state.mapImageTemp
        })
    }

    handleSafeDistanceChange = (e) => {
        let value = e.target.value
        this.setState({
            safeDistance: value
        })
    }

    handleToggle = () =>
    this.setState((prevState) => ({ active: !prevState.active }))

    openConfirmDialogue = () => this.setState({ openOverrideDialogue: true })
    handleConfirm = () => this.setState({ allowOverride: true, openOverrideDialogue: false })
    handleCancel = () => this.setState({ allowOverride: false, openOverrideDialogue: false })

    onChangeTime     = time => this.setState({ time })

    onChangeFrequency     = (e) => this.setState({ frequency: e.target.value })

    checkColor = (x) => {
        if(x<=25)
            return "red"
        else
            if(x>25&&x<=50)
                return "orange"
        else
            if(x>50&&x<=75)
                return "yellow"
        else
            return "green"                    

    }
	
	render() {
		return(
            <div>
               <Grid columns={2} divided stackable>
                    <Grid.Column>
                    <Grid.Row>
                        <Segment raised>
                    <div className="img">                    
                        <Image 
                        src= {this.state.mapImage}
                        size='large' 
                        bordered 
                        centered
                    />
                    </div>
                    </Segment>
                    </Grid.Row>
                    <Segment raised>
                    <Grid.Row>
                        <Container textAlign="left">
                        <Label  pointing="right" size="large" basic >MAP :</Label> 
                        <input 
                            type="file" 
                            accept="image/png, image/jpeg" 
                            onChange={this.handleImageChange}>
                        </input>

                        <Button onClick={this.handleChange} primary disabled={!this.state.active}>Upload</Button>
                        </Container>
                    </Grid.Row>
                    <br/>
                {/* 2nd row */}
                    <Grid.Row>
                        <Container textAlign="left">
                        <Label  pointing="right" size="large" basic>LOCALIZE AGV :</Label> 
                        
                        <Button disabled={!this.state.active}>Select</Button>
                        <Button primary disabled={!this.state.active}>Finalize</Button>
                        </Container>
                    </Grid.Row>
                    <br/>
                {/* 4nd row */}
                    <Grid.Row>
                        <Container textAlign="left">
                        <Label  pointing="right" size="large" basic >DESTINATIONS :</Label> 
                        
                        <Button disabled={!this.state.active}>Select</Button>
                        <Button primary disabled={!this.state.active}>Finalize</Button>
                        </Container>
                    </Grid.Row>
                    <br/>
                {/* 5nd row */}
                    <Grid.Row>
                    <Container textAlign="left">
                        <Label  pointing="right" size="large" basic >SAFE OBSTACLE DIST :</Label>
                        <Input  
                        placeholder='Enter' 
                        value={this.state.safeDistance} 
                        disabled={!this.state.active}
                        onChange={this.handleSafeDistanceChange}/>
                        </Container>
                    </Grid.Row>
                    </Segment>
                    </Grid.Column>
                    <Grid.Column>
                        <Segment raised>
                        <Container textAlign="center">
                            <Label size="big" pointing="below" basic>EMERGENCY BUTTON</Label>
                            <br />
                            <Button toggle size="big" circular active= {!this.state.active} negative={this.state.active} onClick={this.handleToggle}>
                                 {this.state.active ? "Stop" : "Start"}
                            </Button>

                        </Container>
                        </Segment>

                        <Segment raised>
                        <Container textAlign="center">
                            <Label size="medium" basic>AGV DATA</Label>
                            <br /> <br />
                            <Grid columns={3} divided>
                                 <Grid.Row>
                                     <Grid.Column>
                                        <Label size="big" basic pointing="below">SOC</Label>
                                        <br />
                                        <Label basic color={this.checkColor(this.state.SOC)} size="massive">{this.state.SOC}%</Label>
                                    </Grid.Column>
                                     <Grid.Column>
                                        <Label size="big" basic pointing="below">SOC2</Label>
                                        <br />
                                        <Label basic size="massive">{this.state.SOC2}</Label>
                                        <br /> <br />
                                        <Button primary>RESET</Button>
                                     </Grid.Column>
                                    <Grid.Column>
                                        <Label size="big" basic pointing="below">Total Distance Travlled</Label>
                                        <br />
                                        <Label basic size="massive">{this.state.TDT}</Label>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>

                        </Container>
                        </Segment>
                        <Segment raised>
                        <Container >
                            <Label size="medium" basic>MANUAL OPERATION</Label>
                            <br /> <br />
                           <Button circular negative onClick={this.openConfirmDialogue} disabled={!this.state.active}>OVERRIDE</Button>
                           <Confirm
                                open={this.state.openOverrideDialogue}
                                onCancel={this.handleCancel}
                                onConfirm={this.handleConfirm}
                            />
                            
                        </Container>
                        <br />
                        <Container>
                        <Icon name='arrow up'  disabled={!this.state.allowOverride} size="big"></Icon>
                        <br/>
                        <Icon name='undo' size="big" bordered circular disabled={!this.state.allowOverride}></Icon>
                        <Icon name='circle' size="small"></Icon>
                        <Icon name='redo' size="big" bordered circular disabled={!this.state.allowOverride}></Icon>
                        <br />
                        <Icon name='arrow down' size="big" disabled={!this.state.allowOverride}></Icon>
                        <br/>
                        </Container>
                        
                        </Segment>
                        <Segment>
                        <TimePicker
                            onChange={this.onChangeTime}
                            value={this.state.time}
                        />
                       {" "}
                        <Input 
                            label="Enter frequency"
                             onChange={this.onChangeFrequency}
                             value={this.state.frequency}   
                        />
                        </Segment>
                    </Grid.Column>
                </Grid>
            </div>
        );
	}	
}

export default Main;
