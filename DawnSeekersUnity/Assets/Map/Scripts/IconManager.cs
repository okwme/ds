using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class IconManager : MonoBehaviour
{
    public static IconManager instance;

    [SerializeField]
    private GameObject _buildingIconPrefab,
        _bagIconPrefab,
        _seekerIconPrefab,
        _otherSeekerIconPrefab;

    [SerializeField]
    private MapIconList _iconList;

    private List<IconController> _spawnedIcons;

    private Dictionary<Vector3Int, IconController> spawnedBuildingIcons;
    private Dictionary<Vector3Int, IconController> spawnedBagIcons;
    private Dictionary<string, IconController> spawnedSeekerIcons;
    private Dictionary<Vector3Int, int> seekerPositionCounts;

    private void Awake()
    {
        instance = this;
        spawnedSeekerIcons = new Dictionary<string, IconController>();
        spawnedBuildingIcons = new Dictionary<Vector3Int, IconController>();
        spawnedBagIcons = new Dictionary<Vector3Int, IconController>();
        _spawnedIcons = new List<IconController>();
        ResetSeekerPositionCounts();
    }

    public void ResetSeekerPositionCounts()
    {
        seekerPositionCounts = new Dictionary<Vector3Int, int>();
    }

    public void CreateBuildingIcon(Vector3Int cell)
    {
        IncreaseSeekerPositionCount(cell);
        if (!spawnedBuildingIcons.ContainsKey(cell))
        {
            IconController icon = Instantiate(_buildingIconPrefab, transform, true)
                .GetComponent<IconController>();
            spawnedBuildingIcons.Add(cell, icon);
            icon.Setup(cell, _iconList.icons[1], "Building");
        }
    }

    public void CreateBagIcon(Vector3Int cell)
    {
        IncreaseSeekerPositionCount(cell);
        if (!spawnedBagIcons.ContainsKey(cell))
        {
            IconController icon = Instantiate(_bagIconPrefab, transform, true)
                .GetComponent<IconController>();
            spawnedBagIcons.Add(cell, icon);
            icon.Setup(cell, _iconList.icons[0], "Bag");
        }
    }

    public void CheckBagIconRemoved(Vector3Int cell)
    {
        if (spawnedBagIcons.ContainsKey(cell))
        {
            spawnedBagIcons[cell].DestroyIcon();
            spawnedBagIcons.Remove(cell);
        }
    }

    public void CheckBuildingIconRemoved(Vector3Int cell)
    {
        if (spawnedBuildingIcons.ContainsKey(cell))
        {
            spawnedBuildingIcons[cell].DestroyIcon();
            spawnedBuildingIcons.Remove(cell);
        }
    }

    // Because Seekers from the map and seekers in the player object are seen as different types I've had to overload this function
    public void CreateSeekerIcon(
        Cog.Seekers seeker,
        Vector3Int cell,
        bool isPlayer,
        int numSeekersAtPos
    )
    {
        CreateSeekerIcon(seeker.Id, cell, isPlayer, numSeekersAtPos);
    }

    public void CreateSeekerIcon(
        Cog.Seekers3 seeker,
        Vector3Int cell,
        bool isPlayer,
        int numSeekersAtPos
    )
    {
        CreateSeekerIcon(seeker.Id, cell, isPlayer, numSeekersAtPos);
    }

    public void CreateSeekerIcon(
        string seekerId,
        Vector3Int cell,
        bool isPlayer,
        int numSeekersAtPos
    )
    {
        IncreaseSeekerPositionCount(cell);
        int buildingOnCell = (spawnedBuildingIcons.ContainsKey(cell) ? 1 : 0);
        if (!spawnedSeekerIcons.ContainsKey(seekerId))
        {
            IconController icon;
            if (isPlayer)
                icon = Instantiate(_seekerIconPrefab, transform, true)
                    .GetComponent<IconController>();
            else
                icon = Instantiate(_otherSeekerIconPrefab, transform, true)
                    .GetComponent<IconController>();
            spawnedSeekerIcons.Add(seekerId, icon);
            icon.Setup(cell, numSeekersAtPos + buildingOnCell, seekerPositionCounts[cell] - 1);
        }
        else
        {
            spawnedSeekerIcons[seekerId].CheckPosition(
                cell,
                numSeekersAtPos + buildingOnCell,
                seekerPositionCounts[cell] - 1,
                isPlayer
            );
        }
    }

    // TODO: This should be called. We don't have a list of seekers the same way anymore
    public void CheckSeekerRemoved(List<Cog.Seeker> currentSeekers)
    {
        var filteredDictionary = spawnedSeekerIcons
            .Where(pair => !currentSeekers.Any(item => item.Id == pair.Key))
            .ToDictionary(pair => pair.Key, pair => pair.Value);
        foreach (KeyValuePair<string, IconController> icon in filteredDictionary)
        {
            icon.Value.DestroyIcon();
            spawnedSeekerIcons.Remove(icon.Key);
        }
    }

    private void IncreaseSeekerPositionCount(Vector3Int cell)
    {
        if (!seekerPositionCounts.ContainsKey(cell))
            seekerPositionCounts.Add(cell, 1);
        else
            seekerPositionCounts[cell]++;
    }

    public void RemoveSeekers(List<Cog.Seekers> seekers)
    {
        var filteredDictionary = spawnedSeekerIcons
            .Where(pair => seekers.Any(s => s.Id == pair.Key))
            .ToDictionary(pair => pair.Key, pair => pair.Value);
        foreach (KeyValuePair<string, IconController> icon in filteredDictionary)
        {
            icon.Value.DestroyIcon();
            spawnedSeekerIcons.Remove(icon.Key);
        }
    }

    public void RemoveSeeker(Cog.Seekers seeker)
    {
        if (spawnedSeekerIcons.ContainsKey(seeker.Id))
        {
            spawnedSeekerIcons[seeker.Id].DestroyIcon();
            spawnedSeekerIcons.Remove(seeker.Id);
        }
    }

    //public void CreateMapIcon(MapManager.MapCell cell)
    //{
    //    GameObject icon = Instantiate(_buildingIconPrefab, transform);
    //    icon.transform.position = MapManager.instance.grid.CellToWorld(GridExtensions.CubeToGrid(cell.cubicCoords));
    //    _spawnedIcons.Add(icon.GetComponent<IconController>());
    //    _spawnedIcons[_spawnedIcons.Count - 1].Setup(_iconList.icons[cell.iconID],cell.cellName);
    //}

    public void ClearMapIcons()
    {
        foreach (IconController icon in _spawnedIcons)
        {
            icon.DestroyIcon();
        }
        _spawnedIcons.Clear();
    }
}