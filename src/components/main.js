import axios from 'axios';
import React, { Component } from 'react';
import { Grid, Image, Label, Button, Container, Input, Segment, Confirm, Icon, Radio } from 'semantic-ui-react';
import './main.css';

import socketIOClient from 'socket.io-client';

import TimePicker from 'react-time-picker';

class Main extends Component {
	constructor() {
		super();
		this.state = {
			mapImage: 'https://react.semantic-ui.com/images/wireframe/image.png',
			mapImageTemp: '',
			safeDistance: 10,
			active: true,
			SOC: '98',
			SOC2: '6',
			TDT: '0.3',
			openOverrideDialogue: false,
			allowOverride: false,
			time: '10:00',
			frequency: 0,
			installationMode: false,
			endpoint: 'http://10.42.0.68:8080',
		};
		this.readFile = this.readFile.bind(this);
	}

	componentDidMount() {
		this.loadData();
		this.interval = setInterval(() => {
			this.loadData();
		}, 1000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	async loadData() {
		const { endpoint } = this.state;
		try {
			const res = await fetch(endpoint);
			const blocks = await res.json();
			const SOC = blocks.SOC;
			const SOC2 = blocks.current_distance;
			const TDT = blocks.speed;
			console.log(blocks);

			this.setState({
				SOC: SOC,
				SOC2: SOC2,
				TDT: TDT,
			});
		} catch (e) {
			console.log(e);
		}
	}

	readFile = file => {
		return new Promise(resolve => {
			const reader = new FileReader();
			reader.addEventListener('load', () => resolve(reader.result), false);
			reader.readAsDataURL(file);
		});
	};

	handleImageChange = async e => {
		const imageDataUrl = await this.readFile(e.target.files[0]);
		this.setState({
			mapImageTemp: imageDataUrl,
		});
	};

	handleChange = () => {
		this.setState({
			mapImage: this.state.mapImageTemp,
		});
	};

	handleSafeDistanceChange = e => {
		let value = e.target.value;
		this.setState({
			safeDistance: value,
		});
	};

	handleToggle = () => this.setState(prevState => ({ active: !prevState.active }));

	openConfirmDialogue = () => {
		if (this.state.allowOverride === false) {
			this.setState({ openOverrideDialogue: true });
		} else {
			this.setState({ allowOverride: false });
		}
	};
	handleConfirm = () => this.setState({ allowOverride: true, openOverrideDialogue: false });
	handleCancel = () => this.setState({ allowOverride: false, openOverrideDialogue: false });

	onChangeTime = time => this.setState({ time });

	onChangeFrequency = e => this.setState({ frequency: e.target.value });

	checkColor = x => {
		if (x <= 25) return 'red';
		else if (x > 25 && x <= 50) return 'orange';
		else if (x > 50 && x <= 75) return 'yellow';
		else return 'green';
	};

	checkOverrideColor = x => {
		if (x === true) return 'green';
		else return 'red';
	};

	toggleInstallationMode = () => this.setState(prevState => ({ installationMode: !prevState.installationMode }));

	testRequest = () => {
		console.log('yu');
	};

	render() {
		return (
			<div>
				<Container fluid>
					<Image.Group size="tiny">
						<Image floated="left" src={process.env.PUBLIC_URL + 'tetrahedron_logo.png'} />;
						<Image floated="right" src={process.env.PUBLIC_URL + 'iitr_logo.png'} />;
					</Image.Group>
				</Container>
				<Grid columns={2} divided stackable>
					<Grid.Column>
						<Grid.Row>
							<Segment raised>
								<div className="img">
									<Image src={this.state.mapImage} size="large" bordered centered />
								</div>
							</Segment>
						</Grid.Row>
						<Segment raised>
							<Grid.Row>
								<Container textAlign="left">
									<Label pointing="right" size="large" basic>
										MAP :
									</Label>
									<input
										type="file"
										accept="image/png, image/jpeg, image/jpg"
										onChange={this.handleImageChange}
									></input>

									<Button
										onClick={this.handleChange}
										primary
										disabled={!this.state.active || this.state.installationMode}
									>
										Upload
									</Button>
								</Container>
							</Grid.Row>
							<br />
							{/* 2nd row */}
							<Grid.Row>
								<Container textAlign="left">
									<Label pointing="right" size="large" basic>
										LOCALIZE AGV :
									</Label>

									<Button disabled={!this.state.active || this.state.installationMode}>Select</Button>
									<Button primary disabled={!this.state.active || this.state.installationMode}>
										Finalize
									</Button>
								</Container>
							</Grid.Row>
							<br />
							{/* 4nd row */}
							<Grid.Row>
								<Container textAlign="left">
									<Label pointing="right" size="large" basic>
										DESTINATIONS :
									</Label>

									<Button disabled={!this.state.active || this.state.installationMode}>Select</Button>
									<Button primary disabled={!this.state.active || this.state.installationMode}>
										Finalize
									</Button>
								</Container>
							</Grid.Row>
							<br />
						</Segment>
						<Segment>
							<TimePicker
								onChange={this.onChangeTime}
								value={this.state.time}
								disabled={!this.state.active || this.state.installationMode}
							/>{' '}
							<Input
								label="Enter frequency"
								onChange={this.onChangeFrequency}
								value={this.state.frequency}
								disabled={!this.state.active || this.state.installationMode}
							/>
						</Segment>
					</Grid.Column>
					<Grid.Column>
						<Segment raised>
							<Container textAlign="center">
								<Label size="big" pointing="below" basic>
									EMERGENCY BUTTON
								</Label>
								<br />
								<Button
									toggle
									size="big"
									circular
									active={!this.state.active}
									negative={this.state.active}
									onClick={this.handleToggle}
								>
									{this.state.active ? 'Stop' : 'Start'}
								</Button>
							</Container>
						</Segment>

						<Segment raised>
							<Container textAlign="center">
								<Label size="medium" basic>
									AGV DATA
								</Label>
								<br /> <br />
								<Grid columns={3} divided>
									<Grid.Row>
										<Grid.Column>
											<Label size="big" basic pointing="below">
												Battery
											</Label>
											<br />
											<Label basic color={this.checkColor(this.state.SOC)} size="massive">
												{this.state.SOC}%
											</Label>
										</Grid.Column>
										<Grid.Column>
											<Label size="big" basic pointing="below">
												Current Distance
											</Label>
											<br />
											<Label basic size="massive">
												{this.state.SOC2}
											</Label>
											<br /> <br />
											<Button
												primary
												onClick={this.testRequest}
												disabled={!this.state.active || this.state.installationMode}
											>
												RESET
											</Button>
										</Grid.Column>
										<Grid.Column>
											<Label size="big" basic pointing="below">
												Speed
											</Label>
											<br />
											<Label basic size="massive">
												{this.state.TDT}
											</Label>
										</Grid.Column>
									</Grid.Row>
								</Grid>
							</Container>
						</Segment>
						<Segment raised>
							<Grid columns={2} divided>
								<Grid.Column>
									<Label size="medium" basic>
										INSTALLATION MODE
									</Label>
									<br />
									<br />
									<br />
									<br />
									<Label size="medium" basic>
										Operation
									</Label>
									<Radio
										toggle
										checked={this.state.installationMode}
										onChange={this.toggleInstallationMode}
										disabled={!this.state.active || this.state.allowOverride}
									></Radio>
									<Label size="medium" basic>
										Installation
									</Label>
								</Grid.Column>

								<Grid.Column>
									<Container>
										<Label size="medium" basic>
											MANUAL OPERATION
										</Label>
										<br /> <br />
										<Button
											circular
											color={this.checkOverrideColor(this.state.allowOverride)}
											onClick={this.openConfirmDialogue}
											disabled={!this.state.active || this.state.installationMode}
										>
											OVERRIDE
										</Button>
										<Confirm
											open={this.state.openOverrideDialogue}
											onCancel={this.handleCancel}
											onConfirm={this.handleConfirm}
										/>
									</Container>
									<br />
									<Container>
										<Icon
											name="arrow up"
											disabled={!this.state.allowOverride && !this.state.installationMode}
											size="big"
										></Icon>
										<br />
										<Icon
											name="undo"
											size="big"
											bordered
											circular
											disabled={!this.state.allowOverride && !this.state.installationMode}
										></Icon>
										<Icon name="circle" size="small"></Icon>
										<Icon
											name="redo"
											size="big"
											bordered
											circular
											disabled={!this.state.allowOverride && !this.state.installationMode}
										></Icon>
										<br />
										<Icon
											name="arrow down"
											size="big"
											disabled={!this.state.allowOverride && !this.state.installationMode}
										></Icon>
										<br />
									</Container>
								</Grid.Column>
							</Grid>
						</Segment>
					</Grid.Column>
				</Grid>
			</div>
		);
	}
}

export default Main;
