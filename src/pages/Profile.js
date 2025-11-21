import '../styles/Profile.css'

function Profile({ user }) {
    const portStocks = ['1', '2', '3', '4', '5']
    return (
        <div className="profile">
            <div className="personal pgriditem">
                {user.name}
            </div>
            <div className="values pgriditem">
                <div className='value'>1</div>
                <div className='value'>2</div>
                <div className='value'>3</div>
            </div>
            <h1>Your Portfolio</h1>
            <div className="portfolio pgriditem">
                <ul>{
                    portStocks.map((item) => <li className='gridListItem'>{item}</li>)
                }</ul>
            </div>
        </div>
    )
}

export default Profile;