const getAllJobs = (req, res) => {
    req.send('get all jobs')
}

const getJob = (req, res) => {
    req.send('get a single job')
}

const createJob = (req, res) => {
    req.send('create a job')
}

const updateJob = (req, res) => {
    req.send('update job')
}

const deleteJob = (req, res) => {
    req.send('delete job')
}


module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
}