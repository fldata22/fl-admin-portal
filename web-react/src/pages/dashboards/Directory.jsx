import { MemberContext } from 'contexts/MemberContext'
import React, { useContext } from 'react'
import { Container, Button } from 'react-bootstrap'
import { useHistory } from 'react-router'

const Directory = () => {
  const { currentUser, theme } = useContext(MemberContext)
  let history = useHistory()

  return (
    <Container className="text-center">
      <h1>{`${currentUser.fullName}'s Directory`}</h1>

      <div className="d-grid gap-2">
        <Button
          onClick={() => history.push('/directory/members')}
          variant="primary"
          size="lg"
          className={`btn-${theme}`}
        >
          Members
        </Button>
        <Button
          onClick={() => history.push('/directory/churches')}
          variant="secondary"
          size="lg"
          className={`btn-${theme} `}
        >
          Churches
        </Button>
      </div>
    </Container>
  )
}

export default Directory
