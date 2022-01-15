import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { editThisChannel, deleteThisChannel } from '../../store/channel';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom'


function EditChannel() {
    const { serverId, channelId } = useParams();
    const dispatch = useDispatch();
    const [channel_name, setChannelName] = useState("")
    const [errors, setErrors] = useState([]);
    let history = useHistory()


    const deleteChannel = () => {
        dispatch(deleteThisChannel(channelId))
        history.push(`/servers/${serverId}/channels`)
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        if (channel_name.length < 5 || channel_name.length > 100) {
            setErrors(['Channel name must be between 5 and 100 characters'])
        }
        else {
            setErrors([])
            history.push(`/servers/${serverId}/channels`)
            return dispatch(editThisChannel({ channel_name, channelId }))
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors.length > 0) setErrors(data.errors)
                })
        }
    }


    return (
        <div className='edit_channel_page'>
            <form className='edit_channel_form' onSubmit={handleSubmit}>
                <div className='main_section'>
                    <ul>
                        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                    </ul>
                    <h1 className='user_auth_welcome'>Edit Channel</h1>
                    <div className='edit_channel_input'>
                    <label>
                        Channel Name
                        <input
                            type="text"
                            name='channel_name'
                            value={channel_name}
                            onChange={(e) => setChannelName(e.target.value)}
                            required
                        />
                    </label>
                    </div>
                    <button type="submit">Edit Channel</button>
                    <button onClick={deleteChannel}>Delete Channel</button>
                </div>
            </form>
        </div>
    )
}

export default EditChannel;
