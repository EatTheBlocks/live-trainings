import React, { useState } from 'react'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'

function AddVideo(props) {
  const [newVideoURL, setNewVideoURL] = useState('/videos/sample_video1.mp4')
  const [newSongUsed, setNewSongUsed] = useState('Hello by Adele')
  const [newDescription, setNewDescription] = useState(
    'The biggest crypto conference in Taiwan'
  )

  const [show, setShow] = useState(false)

  // Add new video to the contract
  const addNewVideo = async () => {
    if (newVideoURL && newSongUsed && newDescription) {
      await props.contract.addVideo(newVideoURL, newSongUsed, newDescription)
    }
    setShow(false)
  }

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <>
      <Button variant='primary' onClick={handleShow}>
        Upload video
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add a new video to your channel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <b>This will add the video metadata to the smart contract</b>
          <Form>
            <Form.Group className='mb-3' controlId='videoDetails'>
              <Form.Label>Enter the video URL</Form.Label>
              <Form.Control
                type='text'
                defaultValue='/videos/sample_video1.mp4'
                onChange={(e) => setNewVideoURL(e.target.value)}
              />
              <Form.Label>
                Enter the song you want to use in the video
              </Form.Label>
              <Form.Control
                type='text'
                defaultValue='Hello by Adele'
                onChange={(e) => setNewSongUsed(e.target.value)}
              />
              <Form.Label>Enter the description for your video</Form.Label>
              <Form.Control
                type='text'
                defaultValue='The biggest crypto conference in Taiwan'
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Cancel
          </Button>
          <Button variant='primary' onClick={addNewVideo}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AddVideo
