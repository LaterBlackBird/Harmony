import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNewChannel } from '../../store/channel';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom'


function CreateChannel() {
    const { serverId } = useParams();
    const dispatch = useDispatch();
    const [channel_name, setChannelName] = useState("")
    const [errors, setErrors] = useState([]);
    let history = useHistory()


    const handleSubmit = (e) => {
        e.preventDefault();
        if (channel_name.length < 5 || channel_name.length > 100) {
            setErrors(['Channel name must be between 5 and 100 characters'])
        }
        else {
            setErrors([])
            history.push(`/servers/${serverId}/channels`)
            return dispatch(addNewChannel({ serverId, channel_name }))
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors.length > 0) setErrors(data.errors)
                })
        }
    }


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <ul>
                    {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                </ul>
                <h1>Create a Channel!</h1>
                <label>
                    Channel name
                    <input
                        type="text"
                        name='channel_name'
                        value={channel_name}
                        onChange={(e) => setChannelName(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Create Channel</button>
            </form>
        </div>
    )
}

export default CreateChannel;
