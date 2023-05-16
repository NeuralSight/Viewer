/**
 * Produces a QIDO URL given server details and a set of specified search filter
 * items
 *
 * @param filter
 * @param serverSupportsQIDOIncludeField {
 * Patientid,
 * StudyDescription
 * Modality
 * startDate or simply StudyDate
 * endDate
 *
 * }
 * @returns {string} The URL with encoded filter query data
 */
function mapParams(params, options = {}) {
  const { supportsWildcard } = options;
  const withWildcard = value => {
    return supportsWildcard && value ? `*${value}*` : value;
  };
  // incoming paramters
  const parameters = {
    PatientId: withWildcard(params.PatientId),
    '00100020': withWildcard(params.PatientId),
    StudyDescription: withWildcard(params.studyDescription),
    ModalitiesInStudy: params.Modality,
    // Other
    limit: params.limit || 101,
    offset: params.offset || 0,
    fuzzymatching: options.supportsFuzzyMatching === true,
    includefield: commaSeparatedFields,
    // serverSupportsQIDOIncludeField ? commaSeparatedFields : 'all',
  };
  // build the StudyDate range parameter
  if (params.startDate && params.endDate) {
    parameters.StudyDate = `${params.startDate}-${params.endDate}`;
  } else if (params.startDate) {
    const today = new Date();
    const DD = String(today.getDate()).padStart(2, '0');
    const MM = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const YYYY = today.getFullYear();
    const todayStr = `${YYYY}${MM}${DD}`;

    parameters.StudyDate = `${params.startDate}-${todayStr}`;
  } else if (params.endDate) {
    const oldDateStr = `19700102`;

    parameters.StudyDate = `${oldDateStr}-${params.endDate}`;
  }

  // Build the StudyInstanceUID parameter
  if (params.studyInstanceUid) {
    let studyUids = params.studyInstanceUid;
    studyUids = Array.isArray(studyUids) ? studyUids.join() : studyUids;
    studyUids = studyUids.replace(/[^0-9.]+/g, '\\');
    parameters.StudyInstanceUID = studyUids;
  }

  // Clean query params of undefined values.
  const final = {};
  Object.keys(parameters).forEach(key => {
    if (parameters[key] !== undefined && parameters[key] !== '') {
      final[key] = parameters[key];
    }
  });

  return final;
}

export { mapParams };
