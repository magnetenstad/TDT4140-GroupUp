import React, {useContext, useEffect, useState} from 'react';
import {Container, Stack, Card, Grid, Button, Dialog, DialogTitle, Select, MenuItem, FormControl, InputLabel, Snackbar, Alert}
  from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {UserContext} from '../contexts/User';

export default function ExplorePage() {
  const navigate = useNavigate();
  const [allGroups, setAllGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedGroupA, setSelectedGroupA] = useState({});
  const [selectedGroupBId, setSelectedGroupBId] = useState('');
  const [userState, _] = useContext(UserContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [incompleteMatches, setIncompleteMatches] = useState([]);

  useEffect(async () => {
    await fetchAllGroups();
    await fetchMyGroups();
  }, []);

  const fetchAllGroups = async () => {
    fetch('/api/get-groups')
        .then((res) => res.json())
        .then((result) => {
          setAllGroups(result);
        });
  };

  const fetchMyGroups = async () => {
    fetch('/api/get-groups-with-user', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username: userState.username}),
    }).then((res) => res.json())
        .then((result) => {
          setMyGroups(result);
        });
  };

  const fetchIncompleteMatches = async (groupId) => {
    fetch('/api/get-incomplete-group-matches', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({groupId: groupId}),
    }).then((res) => res.json())
        .then((result) => {
          setIncompleteMatches(result);
        });
  };

  const createMatch = async () => {
    fetch('/api/match-groups', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        primaryId: selectedGroupA.groupId,
        secondaryId: selectedGroupBId,
      }),
    }).then((res) => {
      if (res.ok) {
        setSnackbarOpen(true);
      } else {
        // Did not create match
      }
    });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <br />
      <br />
      <Button
        variant='outlined'
        onClick={() => navigate('/home')}
      >
        Home
      </Button>
      <h1>Explore groups</h1>
      <p>Find the perfect match.</p>

      <Stack spacing={2}>
        {Array.from(allGroups).map((group) => (
          <Card key={group.groupId} sx={{padding: '2rem'}}>
            <h2>{group.name}</h2>
            <p>Group {group.groupId}</p>
            <Button
              variant='contained'
              onClick={() => {
                setSelectedGroupA(group);
                fetchIncompleteMatches(group.groupId);
                setDialogOpen(true);
              }}
            >
              Match
            </Button>
          </Card>
        ))}
      </Stack>

      <Dialog onClose={() => setDialogOpen(false)} open={dialogOpen}>
        <Container sx={{padding: '1rem'}}>
          <DialogTitle>Select match</DialogTitle>
          {!Boolean(myGroups.length) && <div>
            <Stack>
              <p>
                You have to be member of a group to match with other groups!
              </p>
              <br />
              <Button
                variant='outlined'
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
            </Stack>
          </div>}
          {Boolean(myGroups.length) && <div>
            <p>What group do you want to match <b>{selectedGroupA.name}</b> with?</p>
            <br />
            <FormControl fullWidth>
              <InputLabel id="group-select-label">Group</InputLabel>
              <Select
                labelId='group-select-label'
                label='Group'
                value={selectedGroupBId}
                onChange={(e) => setSelectedGroupBId(e.target.value)}
              >
                {Array.from(myGroups).filter((group) =>
                  (group.groupId !== selectedGroupA.groupId),
                ).map((group) => (
                  <MenuItem
                    key={group.groupId}
                    value={group.groupId}
                  >
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <br />
            <br />

            <Stack
              direction="row"
              justifyContent="space-between"
            >
              <Button
                variant='outlined'
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant='contained'
                disabled={
                  Boolean(incompleteMatches.some((e) => 
                    e.groupId === selectedGroupBId
                  ))
                }
                onClick={() => {
                  createMatch();
                  setDialogOpen(false);
                }}
              >
                {
                  !Boolean(incompleteMatches.some((e) => 
                    e.groupId === selectedGroupBId
                  )) && <span>Confirm</span>
                }
                {
                  Boolean(incompleteMatches.some((e) => 
                    e.groupId === selectedGroupBId
                  )) && <span>Match already initiated</span>
                }
              </Button>
            </Stack>
          </div>}
        </Container>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{width: '100%'}}>
          Match initiated!
        </Alert>
      </Snackbar>

    </Container>
  );
}