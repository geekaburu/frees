import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, withScriptjs } from 'react-google-maps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import MapInformationMarker from './MapInformationMarker'

const GoogleMapContainer = withScriptjs(withGoogleMap(props => (
    <GoogleMap
        center = { props.center }
        zoom = { props.zoom }
        mapTypeId = { props.mapTypeId }>
        {props.markers.map(marker => (
            <MapInformationMarker 
                position = {{lat: Number(marker.location.latitude), lng: Number(marker.location.longitude)}}
                data = {{
                    id:marker.id,
                    customer:marker.name,
                    panels:marker.panels,
                    county:marker.location.county,
                    town:marker.location.town,
                    energy:marker.energy,
                }}
                key = {props.markers.indexOf(marker)}
                link = {props.link}
            />
        ))}
    </GoogleMap>
)));

export default class Map extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    } 
    render() {    
        return(
            <div>
                <GoogleMapContainer
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDNMp5iJ-CuAkCdOEEvBIAge5jDvaBhH6o&v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={ <div style={{ height: this.props.contentHeight, width: this.props.contentWidth }} /> }
                    mapElement={ <div style={{ height: '100%' }} /> }
                    center = {this.props.center }
                    zoom = { this.props.zoom }
                    mapTypeId = { this.props.mapTypeId }
                    markers = { this.props.markers }
                    link = {this.props.link}
                />
            </div>
        )
    }
}