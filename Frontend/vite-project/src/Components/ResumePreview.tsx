import React from 'react';
import { Stack, Text, Label } from '@fluentui/react';
const ResumePreview = ({ user }: { user: any }) => {
  if (!user) return null;
  console.log("User", user);

  const formatName = (name: string) => {
    return name.trim().replace(/\s+/g, ' ');
  };

  const renderAddress = (address: any) => {
    if (!address) return <Text>Not Available</Text>;
    const { house, street, landmark, district, city, pincode, state } = address;
    return (
      <Stack styles={{ root: { marginBottom: '10px' } }}>
        <Text>{house} ,{street} ,{landmark}</Text>
        <Text>{district} ,{city} ,{pincode}</Text>
        {/* <Text>House : {house}</Text>
        <Text>Street : {street}</Text>
        <Text>Landmark : {landmark}</Text>
        <Text>District : {district}</Text>
        <Text>City : {city}</Text>
        <Text>Pincode : {pincode}</Text> */}
        <Text>{state}</Text>
      </Stack>
    );
  };
  return (
    <Stack horizontal styles={{ root: { height: '90vh', padding: '1px', border: '1px solid #D3D3D3' } }}>
      {/* Left Section */}
      <Stack styles={{ root: { width: '35%', backgroundColor: '#DEE4EB', padding: '20px' } }}>
        <Stack verticalAlign='center' horizontalAlign='center' >

          <img src={user.image} alt="Profile" style={{ width: '150px', height: '150px', marginBottom: '25px' }} />
        </Stack>

        <Label>Contact</Label>
        <Text>{user.email}</Text>
        <Text>+91 {user.phone}</Text>
        <hr style={{ width: '98%', color: 'black', fontSize: 'bold' }}></hr>
        {/* <hr style="width:50%;text-align:left;margin-left:0"></hr> */}
        <Label>Address</Label>
        {renderAddress(user.address)}
        <hr style={{ width: '95%', color: 'black', fontSize: 'bold' }}></hr>
        <Label>About</Label>
        <Text>{user.about}</Text>

      </Stack>
      {/* Right Section */}
      <Stack styles={{ root: { width: '65%', backgroundColor: 'white', padding: '20px' } }}>
      <Text variant="xxLarge">
          {formatName(user.name).split(' ').map((part: string, index: number) => (
            <React.Fragment key={index}>
              {part}
              {index < user.name.split(' ').length - 1 && <br />}
            </React.Fragment>
          ))}
        </Text>
        <hr style={{ width: '80%', color: 'black', fontSize: 'bold', marginRight: '20%' }}></hr>
        <Text variant="xLarge">{user.designation}</Text>
        <Label>Education</Label>
        {Array.isArray(user.education) ? (
          user.education.map((edu: any, index: number) => (
            <Stack key={index} styles={{ root: { marginBottom: '10px' } }}>
              <Text>School: {edu.school}</Text>
              <Text>Class: {edu.class}</Text>
              <Text>CGPA: {edu.cgpa}</Text>
              <Text>Year of Passing: {edu.yearOfPassing}</Text>
            </Stack>
          ))
        ) : (
          <Text>Not Available</Text>
        )}
        <hr style={{ width: '80%', color: 'black', fontSize: 'bold', marginRight: '20%' }}></hr>
        <Label>Experience</Label>
        {Array.isArray(user.experience) ? (
          user.experience.map((exp: any, index: number) => (
            <Stack key={index} styles={{ root: { marginBottom: '10px' } }}>
              <Text>Role: {exp.designation}</Text>
              <Text>Duration: {exp.fromDate}</Text>
              <Text>Skills: {exp.skills.map((e: object) => `${e} ,`)}</Text>
            </Stack>
          ))
        ) : (
          <Text>Not Available</Text>
        )}
        <hr style={{ width: '80%', color: 'black', fontSize: 'bold', marginRight: '20%' }}></hr>
        <Label>Signature</Label>
        {user.signature ? (
          <img src={user.signature} alt="Signature" style={{ width: '150px', marginRight: '20px' }} />
        ) : (
          <Text>Not Available</Text>
        )}
      </Stack>
    </Stack>
  );
};
export default ResumePreview;