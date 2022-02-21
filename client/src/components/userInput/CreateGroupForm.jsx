import React, { useContext, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {Card, Button, Stack, TextField, Chip} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { nanoid } from 'nanoid'
import {UserContext} from '../../contexts/User';

export default function CreateGroupForm() {
  const [badRequest, setBadRequest] = useState(false);
  const {register, formState: {errors}, handleSubmit} = useForm();
  const [userState, _] = useContext(UserContext);
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    setBadRequest(false);
    data.id = nanoid();
    data.admin = userState.username;
    fetch('/api/insert-group', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.ok) {
        navigate('/group/' + data.id);
      } else {
        setBadRequest(true);
      }
    });
  };

  return (
    <Card elevation={5}>
      <form style={{padding: '2rem'}} onSubmit={handleSubmit(onSubmit)}>
        <h2>Create a new group</h2>
        <div>
          <TextField
            required
            fullWidth
            margin="normal"
            error={errors.name}
            helperText={errors.name && 'A group name is required.'}
            label="Name"
            type={'text'}
            {...register('name', {required: true})}
          />
        </div>

        <div>
          <TextField
            required
            fullWidth
            margin="normal"
            error={errors.description}
            helperText={errors.description && 'A description is required.'}
            label="Description"
            type={'text'}
            {...register('description', {required: true})}
          />
        </div>

        <div>
          <TextField
            disabled
            fullWidth
            margin="normal"
            error={errors.interests}
            helperText={errors.interests && 'Interests are required.'}
            label="Interests - TODO"
            type={'text'}
            {...register('interests', {required: false})}
          />
        </div>

        <div>
          <TextField
            disabled
            fullWidth
            margin="normal"
            error={errors.members}
            label="Add members - TODO"
            type={'text'}
            {...register('members', {required: false})}
          />
        </div>
        <br></br>
        <Stack
          spacing={2}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            onClick={() => navigate('/home')}
          >
            Cancel
          </Button>
          {badRequest && <Chip
            color="error"
            label="Something went wrong!"
            onDelete={() => setBadRequest(false)}
            deleteIcon={<CloseIcon />}
          />}
          <Button
            variant="contained"
            type="submit"
          >
            Create Group
          </Button>
        </Stack>

      </form>
    </Card>
  );
}
