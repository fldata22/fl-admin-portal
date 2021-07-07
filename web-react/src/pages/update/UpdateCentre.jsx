import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { Formik, Form, FieldArray } from 'formik'
import * as Yup from 'yup'
import { capitalise, makeSelectOptions } from '../../global-utils'
import FormikControl from '../../components/formik-components/FormikControl'

import {
  BISHOP_MEMBER_DROPDOWN,
  GET_BISHOP_CAMPUSES,
  GET_CAMPUS_CENTRES,
  GET_BISHOP_TOWNS,
  GET_TOWN_CENTRES,
} from '../../queries/ListQueries'
import {
  ADD_CENTRE_BACENTAS,
  REMOVE_BACENTA_CENTRE,
  ADD_CENTRE_TOWN,
  ADD_CENTRE_CAMPUS,
  REMOVE_CENTRE_TOWN,
  REMOVE_CENTRE_CAMPUS,
  UPDATE_CENTRE_MUTATION,
} from './UpdateMutations'
import { BISHOP_BACENTA_DROPDOWN } from '../../components/formik-components/ComboboxQueries'
import NavBar from '../../components/nav/NavBar'
import ErrorScreen from '../../components/ErrorScreen'
import LoadingScreen from '../../components/LoadingScreen'
import { ChurchContext } from '../../contexts/ChurchContext'
import { DISPLAY_CENTRE } from '../display/ReadQueries'
import { LOG_CENTRE_HISTORY, LOG_BACENTA_HISTORY } from './LogMutations'
import PlusSign from '../../components/buttons/PlusSign'
import MinusSign from '../../components/buttons/MinusSign'
import { MAKE_CENTRE_LEADER } from './ChangeLeaderMutations'

const UpdateCentre = () => {
  const {
    church,
    centreId,
    townId,
    setTownId,
    setCampusId,
    campusId,
    bishopId,
  } = useContext(ChurchContext)

  const { data: centreData, loading: centreLoading } = useQuery(
    DISPLAY_CENTRE,
    {
      variables: { id: centreId },
    }
  )

  const { data: townListData, loading: townListLoading } = useQuery(
    GET_BISHOP_TOWNS,
    {
      variables: { id: bishopId },
    }
  )
  const { data: campusListData, loading: campusListLoading } = useQuery(
    GET_BISHOP_CAMPUSES,
    {
      variables: { id: bishopId },
    }
  )

  const history = useHistory()
  const centre = centreData?.centres[0]

  const initialValues = {
    centreName: centre?.name,
    leaderName: centre?.leader
      ? `${centre?.leader.firstName} ${centre?.leader.lastName}`
      : '',
    leaderSelect: centre?.leader?.id,
    campusTownSelect:
      church.church === 'town' ? centre?.town?.id : centre?.campus?.id,
    bacentas: centre?.bacentas.length ? centre?.bacentas : [''],
  }

  const validationSchema = Yup.object({
    centreName: Yup.string().required(
      `${capitalise(church.subChurch)} Name is a required field`
    ),
    leaderSelect: Yup.string().required(
      'Please select a leader from the dropdown'
    ),
    bacentas: Yup.array().of(
      Yup.object().required('Please pick a bacenta from the dropdown')
    ),
  })

  const [LogCentreHistory] = useMutation(LOG_CENTRE_HISTORY, {
    refetchQueries: [{ query: DISPLAY_CENTRE, variables: { id: centreId } }],
  })

  const [LogBacentaHistory] = useMutation(LOG_BACENTA_HISTORY, {
    refetchQueries: [{ query: DISPLAY_CENTRE, variables: { id: centreId } }],
  })

  const [MakeCentreLeader] = useMutation(MAKE_CENTRE_LEADER)
  const [UpdateCentre] = useMutation(UPDATE_CENTRE_MUTATION, {
    refetchQueries: [
      { query: DISPLAY_CENTRE, variables: { id: centreId } },
      { query: GET_TOWN_CENTRES, variables: { id: townId } },
      { query: GET_CAMPUS_CENTRES, variables: { id: campusId } },
      {
        query: GET_TOWN_CENTRES,
        variables: { id: initialValues.campusTownSelect },
      },
      {
        query: GET_CAMPUS_CENTRES,
        variables: { id: initialValues.campusTownSelect },
      },
    ],
  })

  //Changes downwards.ie. Changes to the Bacentas underneath the Centre
  const [AddCentreBacentas] = useMutation(ADD_CENTRE_BACENTAS)
  const [RemoveBacentaFromCentre] = useMutation(REMOVE_BACENTA_CENTRE, {
    onCompleted: (data) => {
      let prevCentre = data.updateCentres.centres[0]
      let bacenta = data.updateBacentas.bacentas[0]
      let newCentreId = ''
      let oldCentreId = ''
      let historyRecord

      if (prevCentre.id === centreId) {
        //Bacenta has previous centre which is current centre and is going
        oldCentreId = centreId
        newCentreId = ''
        historyRecord = `${bacenta.name} Bacenta has been closed down under ${initialValues.centreName} Centre`
      } else if (prevCentre.id !== centreId) {
        //Bacenta has previous centre which is not current centre and is joining
        oldCentreId = prevCentre.id
        newCentreId = centreId
        historyRecord = `${bacenta.name} Bacenta has been moved to ${initialValues.centreName} Centre from ${prevCentre.name} Centre`
      }

      //After removing the bacenta from a centre, then you log that change.
      LogBacentaHistory({
        variables: {
          bacentaId: bacenta.id,
          newLeaderId: '',
          oldLeaderId: '',
          newCentreId: newCentreId,
          oldCentreId: oldCentreId,
          historyRecord: historyRecord,
        },
      })
    },
  })

  //Changes upwards. ie. Changes to the CampusTown the Centre is under

  const [RemoveCentreTown] = useMutation(REMOVE_CENTRE_TOWN)
  const [RemoveCentreCampus] = useMutation(REMOVE_CENTRE_CAMPUS)
  const [AddCentreTown] = useMutation(ADD_CENTRE_TOWN, {
    onCompleted: (data) => {
      const oldTown = centre?.town
      const newTown = data.updateCentres.centres[0].town
      if (!oldTown) {
        //If There is no old town
        let recordIfNoOldTown = `${oldTown.name} Centre has been moved to ${
          newTown.name
        } ${capitalise(church.church)} `

        LogCentreHistory({
          variables: {
            centreId: centreId,
            newLeaderId: '',
            oldLeaderId: '',
            newCampusTownId: newTown.id,
            oldCampusTownId: oldTown.id,
            historyRecord: recordIfNoOldTown,
          },
        })
      } else {
        //If there is an old town

        //Break Link to the Old Town
        RemoveCentreTown({
          variables: {
            townId: oldTown.id,
            centreId: centreId,
          },
        })

        let recordIfOldTown = `${oldTown.name} Centre has been moved from ${
          centre?.town.name
        } ${capitalise(church.church)} to ${newTown.name} ${capitalise(
          church.church
        )}`

        //After Adding the centre to a campus/town, then you log that change.
        LogCentreHistory({
          variables: {
            centreId: centreId,
            newLeaderId: '',
            oldLeaderId: '',
            newCampusTownId: newTown.id,
            oldCampusTownId: oldTown.id,
            historyRecord: recordIfOldTown,
          },
        })
      }
    },
  })
  const [AddCentreCampus] = useMutation(ADD_CENTRE_CAMPUS, {
    onCompleted: (data) => {
      const oldCampus = centre?.campus
      const newCampus = data.updateCentres.centres[0].campus
      if (!oldCampus) {
        //If There is no old campus
        let recordIfNoOldCampus = `${
          initialValues.centreName
        } Centre has been moved to ${newCampus.name} ${capitalise(
          church.church
        )} `

        LogCentreHistory({
          variables: {
            centreId: centreId,
            newLeaderId: '',
            oldLeaderId: '',
            newCampusTownId: newCampus.id,
            oldCampusTownId: oldCampus.id,
            historyRecord: recordIfNoOldCampus,
          },
        })
      } else {
        //If there is an old Campus

        //Break Link to the Old Campus
        RemoveCentreCampus({
          variables: {
            campusId: oldCampus.id,
            centreId: centreId,
          },
        })

        let recordIfOldCampus = `${
          initialValues.centreName
        } Centre has been moved from ${oldCampus.name} ${capitalise(
          church.church
        )} to ${newCampus.name} ${capitalise(church.church)}`

        //After Adding the centre to a campus/town, then you log that change.
        LogCentreHistory({
          variables: {
            centreId: centreId,
            newLeaderId: '',
            oldLeaderId: '',
            newCampusTownId: newCampus.id,
            oldCampusTownId: oldCampus.id,
            historyRecord: recordIfOldCampus,
          },
        })
      }
    },
  })

  if (centreLoading || townListLoading || campusListLoading) {
    return <LoadingScreen />
  } else if (centreData && (townListData || campusListData)) {
    //Refactoring the Options into Something that can be read by my formik component
    const townOptions = townListData
      ? makeSelectOptions(townListData.members[0].townBishop)
      : []
    const campusOptions = campusListData
      ? makeSelectOptions(campusListData.members[0].campusBishop)
      : []

    //onSubmit receives the form state as argument
    const onSubmit = (values, onSubmitProps) => {
      if (church.church === 'town') {
        setTownId(values.campusTownSelect)
      }
      if (church.church === 'campus') {
        setCampusId(values.campusTownSelect)
      }

      UpdateCentre({
        variables: {
          centreId: centreId,
          centreName: values.centreName,
          leaderId: values.leaderSelect,
          campusTownId: values.campusTownSelect,
        },
      })

      //Log if Centre Name Changes
      if (values.centreName !== initialValues.centreName) {
        LogCentreHistory({
          variables: {
            centreId: centreId,
            newLeaderId: '',
            oldLeaderId: '',
            oldCampusTownId: '',
            newCampusTownId: '',
            historyRecord: `Centre name has been changed from ${initialValues.centreName} to ${values.centreName}`,
          },
        })
      }

      //Log if the Leader Changes
      if (values.leaderSelect !== initialValues.leaderSelect) {
        MakeCentreLeader({
          variables: {
            leaderId: values.leaderSelect,
            centreId: centreId,
          },
        }).catch((err) => alert(err))
      }

      //Log If The TownCampus Changes
      if (values.campusTownSelect !== initialValues.campusTownSelect) {
        if (church.church === 'town') {
          RemoveCentreTown({
            variables: {
              campusId: initialValues.campusTownSelect,
              centreId: centreId,
            },
          })
          AddCentreTown({
            variables: {
              townId: values.campusTownSelect,
              centreId: centreId,
            },
          })
        } else if (church.church === 'campus') {
          RemoveCentreCampus({
            variables: {
              campusId: initialValues.campusTownSelect,
              centreId: centreId,
            },
          })
          AddCentreCampus({
            variables: {
              campusId: values.campusTownSelect,
              centreId: centreId,
            },
          })
        }
      }

      //For the adding and removing of bacentas
      const oldBacentaList = initialValues.bacentas.map((bacenta) => {
        return bacenta.id
      })

      const newBacentaList = values.bacentas.map((bacenta) => {
        return bacenta.id ? bacenta.id : bacenta
      })

      const removeBacentas = oldBacentaList.filter(function (value) {
        return !newBacentaList.includes(value)
      })

      const addBacentas = values.bacentas.filter(function (value) {
        return !oldBacentaList.includes(value.id)
      })

      removeBacentas.forEach((bacenta) => {
        RemoveBacentaFromCentre({
          variables: {
            centreId: centreId,
            bacentaId: bacenta,
          },
        })
      })
      addBacentas.forEach((bacenta) => {
        if (bacenta.centre) {
          RemoveBacentaFromCentre({
            variables: {
              centreId: bacenta.centre.id,
              bacentaId: bacenta.id,
            },
          })
        } else {
          //Bacenta has no previous centre and is now joining. ie. RemoveBacentaFromCentre won't run
          LogBacentaHistory({
            variables: {
              bacentaId: bacenta.id,
              newLeaderId: '',
              oldLeaderId: '',
              newCentreId: centreId,
              oldCentreId: '',
              historyRecord: `${bacenta.name} 
              Bacenta has been started again under ${initialValues.centreName} Centre`,
            },
          })
        }

        AddCentreBacentas({
          variables: {
            centreId: centreId,
            bacentaId: bacenta.id,
          },
        })
      })

      onSubmitProps.setSubmitting(false)
      onSubmitProps.resetForm()
      history.push(`/${church.subChurch}/displaydetails`)
    }

    return (
      <>
        <NavBar />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(formik) => (
            <div className="body-card py-4 container mt-5">
              <div className="container infobar">{`${capitalise(
                church.subChurch
              )} Update Form`}</div>
              <Form>
                <div className="form-group">
                  <div className="row row-cols-1 row-cols-md-2">
                    {/* <!-- Basic Info Div --> */}
                    <div className="col mb-2">
                      <div className="form-row row-cols-3">
                        <div className="col-9">
                          <FormikControl
                            className="form-control"
                            control="select"
                            name="campusTownSelect"
                            options={
                              church.church === 'town'
                                ? townOptions
                                : campusOptions
                            }
                            label={`Select a ${capitalise(church.church)}`}
                            defaultOption={`Select a ${capitalise(
                              church.church
                            )}`}
                          />
                        </div>
                        <div className="col-9">
                          <FormikControl
                            className="form-control"
                            control="input"
                            name="centreName"
                            label={`Name of ${capitalise(church.subChurch)}`}
                            placeholder={`Name of ${capitalise(
                              church.subChurch
                            )}`}
                          />
                        </div>
                      </div>
                      <div className="form-row row-cols-3">
                        <div className="col-9">
                          <FormikControl
                            control="combobox2"
                            name="leaderSelect"
                            initialValue={initialValues.leaderName}
                            label="Select a CentreLeader"
                            placeholder="Select a Leader"
                            setFieldValue={formik.setFieldValue}
                            optionsQuery={BISHOP_MEMBER_DROPDOWN}
                            queryVariable1="id"
                            variable1={bishopId}
                            queryVariable2="nameSearch"
                            suggestionText="name"
                            suggestionID="id"
                            dataset="bishopMemberDropdown"
                            aria-describedby="Bishop Member List"
                            className="form-control"
                            error={formik.errors.leaderSelect}
                          />
                        </div>
                      </div>
                      <small className="pt-2">
                        {`Select any ${
                          church.subChurch === 'town' ? 'Centres' : 'bacentas'
                        } that are being moved to this ${capitalise(
                          church.subChurch
                        )}`}
                      </small>

                      <FieldArray name="bacentas">
                        {(fieldArrayProps) => {
                          const { push, remove, form } = fieldArrayProps
                          const { values } = form
                          const { bacentas } = values

                          return (
                            <>
                              {bacentas.map((bacenta, index) => (
                                <div key={index} className="form-row row-cols">
                                  <div className="col-9">
                                    <FormikControl
                                      control="combobox2"
                                      name={`bacentas[${index}]`}
                                      initialValue={bacenta?.name}
                                      placeholder="Enter Bacenta Name"
                                      setFieldValue={formik.setFieldValue}
                                      optionsQuery={BISHOP_BACENTA_DROPDOWN}
                                      queryVariable1="id"
                                      variable1={bishopId}
                                      queryVariable2="bacentaName"
                                      suggestionText="name"
                                      suggestionID="id"
                                      church="bacenta"
                                      aria-describedby="Bacenta Name"
                                      returnObject={true}
                                      className="form-control"
                                      error={
                                        formik.errors.bacentas &&
                                        formik.errors.bacentas[index]
                                      }
                                    />
                                  </div>
                                  <div className="col d-flex">
                                    <PlusSign onClick={() => push()} />
                                    {index >= 0 && (
                                      <MinusSign
                                        onClick={() => remove(index)}
                                      />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </>
                          )
                        }}
                      </FieldArray>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    disabled={!formik.isValid || formik.isSubmitting}
                    className="btn btn-primary px-5 py-3"
                  >
                    Submit
                  </button>
                </div>
              </Form>
            </div>
          )}
        </Formik>
      </>
    )
  } else {
    return <ErrorScreen />
  }
}

export default UpdateCentre
